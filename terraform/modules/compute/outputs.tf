output "bastion_public_ip" {
  value = azurerm_public_ip.bastion.ip_address
}

output "app_private_ip" {
  value = azurerm_network_interface.app.private_ip_address
}
