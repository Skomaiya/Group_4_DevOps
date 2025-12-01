output "login_server" {
  description = "Login server for the Azure Container Registry"
  value       = azurerm_container_registry.main.login_server
}

output "admin_username" {
  description = "Admin username for ACR"
  value       = azurerm_container_registry.main.admin_username
  sensitive   = true
}

output "admin_password" {
  description = "Admin password for ACR"
  value       = azurerm_container_registry.main.admin_password
  sensitive   = true
}

output "id" {
  description = "ID of the container registry"
  value       = azurerm_container_registry.main.id
}