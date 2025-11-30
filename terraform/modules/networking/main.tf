# Virtual Network
resource "azurerm_virtual_network" "main" {
  name                = "${var.project_name}-${var.environment}-vnet"
  address_space       = var.vnet_address_space
  location            = var.location
  resource_group_name = var.resource_group_name
  tags                = var.tags
}

# Public Subnet (for Bastion Host)
resource "azurerm_subnet" "public" {
  name                 = "${var.project_name}-${var.environment}-public-subnet"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = [var.public_subnet_prefix]
}

# Private Subnet (for Application VM)
resource "azurerm_subnet" "private" {
  name                 = "${var.project_name}-${var.environment}-private-subnet"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = [var.private_subnet_prefix]

  service_endpoints = ["Microsoft.Sql"]
}

# Database Subnet (for PostgreSQL)
resource "azurerm_subnet" "database" {
  name                 = "${var.project_name}-${var.environment}-db-subnet"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = [var.database_subnet_prefix]

  delegation {
    name = "postgres-delegation"
    service_delegation {
      name = "Microsoft.DBforPostgreSQL/flexibleServers"
      actions = [
        "Microsoft.Network/virtualNetworks/subnets/join/action",
      ]
    }
  }
}

# -------------------------------------------------------
# BASTION NSG — Only YOUR IP can SSH into Bastion
# -------------------------------------------------------
resource "azurerm_network_security_group" "bastion" {
  name                = "${var.project_name}-${var.environment}-bastion-nsg"
  location            = var.location
  resource_group_name = var.resource_group_name
  tags                = var.tags

  security_rule {
    name                       = "AllowSSH"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = var.allowed_ssh_source_ip
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "AllowSSHToPrivate"
    priority                   = 110
    direction                  = "Outbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = "*"
    destination_address_prefix = var.private_subnet_prefix
  }
}

# -------------------------------------------------------
# APPLICATION VM NSG — NO PUBLIC ACCESS
# -------------------------------------------------------
resource "azurerm_network_security_group" "app" {
  name                = "${var.project_name}-${var.environment}-app-nsg"
  location            = var.location
  resource_group_name = var.resource_group_name
  tags                = var.tags

  # Allow SSH only from Bastion
  security_rule {
    name                       = "AllowSSHFromBastion"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = var.public_subnet_prefix
    destination_address_prefix = "*"
  }

  # Allow HTTP inside VNet only
  security_rule {
    name                       = "AllowHTTPInternal"
    priority                   = 110
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "VirtualNetwork"   # FIXED
    destination_address_prefix = "*"
  }

  # Allow HTTPS inside VNet only
  security_rule {
    name                       = "AllowHTTPSInternal"
    priority                   = 120
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "VirtualNetwork"   # FIXED
    destination_address_prefix = "*"
  }

  # Django backend (port 8000) internal only
  security_rule {
    name                       = "AllowBackendInternal"
    priority                   = 130
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "8000"
    source_address_prefix      = "VirtualNetwork"   # FIXED
    destination_address_prefix = "*"
  }

  # React dev server (3000) internal only
  security_rule {
    name                       = "AllowFrontendInternal"
    priority                   = 140
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "3000"
    source_address_prefix      = "VirtualNetwork"   # FIXED
    destination_address_prefix = "*"
  }
}

# Associate NSG with Public Subnet
resource "azurerm_subnet_network_security_group_association" "bastion" {
  subnet_id                 = azurerm_subnet.public.id
  network_security_group_id = azurerm_network_security_group.bastion.id
}

# Associate NSG with Private Subnet
resource "azurerm_subnet_network_security_group_association" "app" {
  subnet_id                 = azurerm_subnet.private.id
  network_security_group_id = azurerm_network_security_group.app.id
}
