# Ansible Deployment Configuration

This directory contains Ansible playbooks and configuration files for deploying the LearnHub application to the Azure VM.

## Prerequisites

1. **Ansible installed** on your local machine:
   ```bash
   # On macOS/Linux
   pip install ansible
   
   # On Windows (using WSL or Git Bash)
   pip install ansible
   ```

2. **SSH access configured**:
   - Your SSH private key should be at `~/.ssh/id_rsa`
   - The same key pair used in Terraform should be available

3. **Terraform outputs**:
   - Run `terraform output` to get the required values

## Setup Instructions

### 1. Get Infrastructure Information

After running `terraform apply`, get the required values:

```bash
cd terraform
terraform output bastion_public_ip
terraform output app_private_ip
terraform output acr_login_server
terraform output acr_admin_username
terraform output acr_admin_password
terraform output db_host
```

### 2. Update Inventory File

Copy the example inventory and update with your values:

```bash
cp ansible/inventory.example ansible/inventory.ini
```

Then edit `ansible/inventory.ini` and replace:
- `<PRIVATE_IP_OF_APP_VM>` or the example IP with your actual private IP from `terraform output app_private_ip`
- `<BASTION_PUBLIC_IP>` or the example IP with your actual bastion IP from `terraform output bastion_public_ip`

Example:
```ini
[app_server]
app-vm ansible_host=10.0.2.4

[app_server:vars]
ansible_user=adminuser
ansible_ssh_private_key_file=~/.ssh/id_rsa
ansible_ssh_common_args='-o ProxyCommand="ssh -W %h:%p -q adminuser@20.123.45.67"'
```

### 3. Test SSH Connection

Test that you can SSH through the bastion:

```bash
ssh -J adminuser@<BASTION_IP> adminuser@<APP_VM_PRIVATE_IP>
```

### 4. Run the Playbook

#### Manual Deployment

```bash
cd ansible

# Set required variables
export ACR_LOGIN_SERVER="your-acr.azurecr.io"
export ACR_USERNAME="your-acr-username"
export ACR_PASSWORD="your-acr-password"
export IMAGE_NAME="learnhub-app"
export IMAGE_TAG="latest"
export DB_HOST="your-db-host.postgres.database.azure.com"
export DB_PASSWORD="your-db-password"

# Run the playbook
ansible-playbook deploy.yml \
  -e acr_login_server=$ACR_LOGIN_SERVER \
  -e acr_username=$ACR_USERNAME \
  -e acr_password=$ACR_PASSWORD \
  -e image_name=$IMAGE_NAME \
  -e image_tag=$IMAGE_TAG \
  -e db_host=$DB_HOST \
  -e db_password=$DB_PASSWORD
```

#### Using Ansible Vault (Recommended for Secrets)

Create a vault file for sensitive data:

```bash
ansible-vault create group_vars/app_server/vault.yml
```

Add your secrets:
```yaml
acr_username: your-acr-username
acr_password: your-acr-password
db_password: your-db-password
```

Then run:
```bash
ansible-playbook deploy.yml --ask-vault-pass
```

## Playbook Tasks

The `deploy.yml` playbook performs the following tasks:

1. **System Updates**: Updates apt cache
2. **Install Packages**: Installs git, curl, wget, and other required packages
3. **Install Docker**: Installs Docker CE and Docker Compose
4. **Configure Docker**: Adds user to docker group
5. **ACR Authentication**: Logs into Azure Container Registry
6. **Deploy Application**: Pulls latest image and starts containers with docker-compose

## Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `acr_login_server` | ACR login server URL | Yes | - |
| `acr_username` | ACR admin username | Yes | - |
| `acr_password` | ACR admin password | Yes | - |
| `image_name` | Docker image name | No | `learnhub-app` |
| `image_tag` | Docker image tag | No | `latest` |
| `db_host` | Database hostname | Yes | - |
| `db_name` | Database name | No | `learnhub_db` |
| `db_user` | Database username | No | `myadmin` |
| `db_password` | Database password | Yes | - |

## Troubleshooting

### SSH Connection Issues

1. **Verify bastion is accessible**:
   ```bash
   ssh adminuser@<BASTION_IP>
   ```

2. **Check SSH key permissions**:
   ```bash
   chmod 600 ~/.ssh/id_rsa
   ```

3. **Test proxy command manually**:
   ```bash
   ssh -o ProxyCommand="ssh -W %h:%p -q adminuser@<BASTION_IP>" adminuser@<APP_VM_IP>
   ```

### Docker Issues

1. **Check Docker is running**:
   ```bash
   ansible app_server -m command -a "systemctl status docker"
   ```

2. **Verify ACR login**:
   ```bash
   ansible app_server -m shell -a "docker login {{ acr_login_server }} -u {{ acr_username }} -p {{ acr_password }}"
   ```

### Playbook Failures

1. **Run with verbose output**:
   ```bash
   ansible-playbook deploy.yml -vvv
   ```

2. **Test connectivity first**:
   ```bash
   ansible app_server -m ping
   ```

## Integration with CD Pipeline

For GitHub Actions CD pipeline, use these steps:

```yaml
- name: Run Ansible Playbook
  run: |
    cd ansible
    ansible-playbook deploy.yml \
      -e acr_login_server=${{ secrets.ACR_LOGIN_SERVER }} \
      -e acr_username=${{ secrets.ACR_USERNAME }} \
      -e acr_password=${{ secrets.ACR_PASSWORD }} \
      -e image_name=learnhub-app \
      -e image_tag=${{ github.sha }} \
      -e db_host=${{ secrets.DB_HOST }} \
      -e db_password=${{ secrets.DB_PASSWORD }}
```

## Notes

- The playbook uses `become: yes` to run tasks with sudo privileges
- Docker Compose is installed both as a plugin and standalone for compatibility
- The application directory is created at `/opt/learnhub`
- Containers are always recreated on deployment to ensure latest changes

