output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.main.name
}

# Networking Outputs
output "vnet_name" {
  description = "Name of the virtual network"
  value       = module.networking.vnet_name
}

# Compute Outputs
output "bastion_public_ip" {
  description = "Public IP address of the Bastion Host"
  value       = module.compute.bastion_public_ip
}

output "app_private_ip" {
  description = "Private IP address of the Application VM"
  value       = module.compute.app_private_ip
}

# Database Outputs
output "database_fqdn" {
  description = "Fully qualified domain name of the PostgreSQL server"
  value       = module.database.database_fqdn
}

output "database_name" {
  description = "Name of the PostgreSQL database"
  value       = module.database.database_name
}

# Container Registry Outputs
output "container_registry_login_server" {
  description = "Login server for the Azure Container Registry"
  value       = module.container_registry.login_server
}

output "container_registry_admin_username" {
  description = "Admin username for ACR"
  value       = module.container_registry.admin_username
  sensitive   = true
}

output "container_registry_admin_password" {
  description = "Admin password for ACR"
  value       = module.container_registry.admin_password
  sensitive   = true
}

# SSH Commands
output "ssh_connection_commands" {
  description = "Commands to connect via SSH"
  value = {
    bastion         = "ssh ${var.admin_username}@${module.compute.bastion_public_ip}"
    app_via_bastion = "ssh -J ${var.admin_username}@${module.compute.bastion_public_ip} ${var.admin_username}@${module.compute.app_private_ip}"
  }
}

# Application URL (using Bastion or Load Balancer in future)
output "application_url" {
  description = "Application URL (temporary)"
  value       = "http://${module.compute.bastion_public_ip}"
}
