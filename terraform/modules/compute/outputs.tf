output "bastion_public_ip" {
  description = "Public IP address of the Bastion Host"
  value       = azurerm_public_ip.bastion.ip_address
}

output "app_public_ip" {
  description = "Public IP address of the Application VM"
  value       = azurerm_public_ip.app.ip_address
}

output "app_private_ip" {
  description = "Private IP address of the Application VM"
  value       = azurerm_network_interface.app.private_ip_address
}

output "bastion_vm_id" {
  description = "ID of the Bastion VM"
  value       = azurerm_linux_virtual_machine.bastion.id
}

output "app_vm_id" {
  description = "ID of the Application VM"
  value       = azurerm_linux_virtual_machine.app.id
}