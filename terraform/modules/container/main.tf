# Azure Container Registry
resource "azurerm_container_registry" "main" {
  name                = "group4devops${var.environment}acr2025"
  resource_group_name = var.resource_group_name
  location            = var.location
  sku                 = "Basic"
  admin_enabled       = true
  tags                = var.tags
}