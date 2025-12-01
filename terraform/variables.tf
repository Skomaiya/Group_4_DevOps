variable "project_name" {
  description = "Name of the project (used for resource naming)"
  type        = string
  default     = "Group-4-DevOps"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "southafricanorth"
}

variable "admin_username" {
  description = "Admin username for VMs"
  type        = string
  default     = "azureuser"
}

variable "admin_ssh_public_key" {
  description = "SSH public key for VM access"
  type        = string
  sensitive   = true
  default     = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC7dffVNJ96yTzoocypnk6ikBhf1mW7kxJXyaPqBoBkpHhIdLAFhfKj4xDJk3vkxZJsKoJH70zLVMSU03j/uj8OnUY45bKqojIz/d1USbh9+YOoixLzUDYHfDLGEnyo/wjgmXJ0/PnxPZIBm4R7/7U9t4q8wzj7aWSLGsR/Id5uw0WyFWRg5c8N3iOZfoQ3zBxmRREcsJ07nhysu2vTDNfgglbiDdBx85vAERss/NuyTZPyxRZRq0FkqBflrecDXkdUzSe1rjcrmyxQiaKaakuj+JrEmYC6b86veOVhW78PhEgyjdbUhWOJquaadByOBOUV33nPIuQrW2rCdrAXZ9MzfUKhZ6BIlZtrnW+bj+0pbkWf3RX8Bf4psW8+Kfyt6aReOhCKogf3IhE7uPiqBhESp8zd5Lpxg0yeCt1iTL2vchp4384na2HgjPa362WgJmuryOWu/33l8RPcZv08DRSrgYWAaLzH3vFwpo2JpG2jm2het3UWUr8lRpnOe1Swn8qgImHfvJcVjmP+k7pUUJgk1ckOtT6Efx4AH5bZ6JTQa3v4jQ336PBiDH3DCiLTKkLb5s+bcCXZDNGmbyyxOyezOZcokxqE6WSAHX1bViSGLvI+IeSC7WXXziSi6sQCYDT5soQIwfUovIZJNLOyVZB8Ndn8TxisM7IMwfa0ThkDgw== user@PC"
}

variable "allowed_ssh_source_ip" {
  description = "Your public IP address for SSH access to bastion"
  type        = string
  default     = "102.22.142.193/32"
}

variable "db_admin_username" {
  description = "Administrator username for database"
  type        = string
  default     = "dbadmin"
}

variable "db_admin_password" {
  description = "Administrator password for database"
  type        = string
  sensitive   = true
  default     = "ChooseAStrongPassword123!"
}

variable "db_name" {
  description = "Name of the database"
  type        = string
  default     = "agriconnect_db"
}

variable "vm_size" {
  description = "Size of the VMs"
  type        = string
  default     = "Standard_B2s_v2"
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    Project     = "Group-4-DevOps"
    ManagedBy   = "Terraform"
    Environment = "Production"
  }
}
