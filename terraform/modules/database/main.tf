# Private DNS Zone for PostgreSQL
resource "azurerm_private_dns_zone" "postgres" {
  name                = "${var.project_name}-${var.environment}.postgres.database.azure.com"
  resource_group_name = var.resource_group_name
  tags                = var.tags
}

# Link Private DNS Zone to VNet
resource "azurerm_private_dns_zone_virtual_network_link" "postgres" {
  name                  = "${var.project_name}-${var.environment}-postgres-vnet-link"
  resource_group_name   = var.resource_group_name
  private_dns_zone_name = azurerm_private_dns_zone.postgres.name
  virtual_network_id    = var.vnet_id
  tags                  = var.tags
}

# PostgreSQL Flexible Server
resource "azurerm_postgresql_flexible_server" "main" {
  name                   = "group4devopsdb"
  resource_group_name    = var.resource_group_name
  location               = var.location
  version                = "14"
  delegated_subnet_id    = var.database_subnet_id
  private_dns_zone_id    = azurerm_private_dns_zone.postgres.id
  administrator_login    = var.db_admin_username
  administrator_password = var.db_admin_password
  zone                   = "1"

  storage_mb = 32768
  sku_name   = "B_Standard_B1ms"

  # Explicitly disable public access (this is the default with delegated_subnet_id)
  public_network_access_enabled = false

  tags = var.tags

  depends_on = [azurerm_private_dns_zone_virtual_network_link.postgres]
}

# PostgreSQL Database
resource "azurerm_postgresql_flexible_server_database" "main" {
  name      = var.db_name
  server_id = azurerm_postgresql_flexible_server.main.id
  collation = "en_US.utf8"
  charset   = "utf8"
}
