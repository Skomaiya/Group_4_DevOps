############################################
# PUBLIC IP FOR BASTION ONLY
############################################

resource "azurerm_public_ip" "bastion" {
  name                = "${var.project_name}-${var.environment}-bastion-pip"
  location            = var.location
  resource_group_name = var.resource_group_name
  allocation_method   = "Static"
  sku                 = "Standard"
  tags                = var.tags
}

############################################
# REMOVE PUBLIC IP FOR APPLICATION VM
# (PRIVATE VM MUST NOT HAVE PUBLIC IP)
############################################

# ❌ This is removed:
# resource "azurerm_public_ip" "app" {...}

############################################
# NETWORK INTERFACE FOR BASTION
############################################

resource "azurerm_network_interface" "bastion" {
  name                = "${var.project_name}-${var.environment}-bastion-nic"
  location            = var.location
  resource_group_name = var.resource_group_name
  tags                = var.tags

  ip_configuration {
    name                          = "internal"
    subnet_id                     = var.public_subnet_id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.bastion.id
  }
}

############################################
# NETWORK INTERFACE FOR APPLICATION VM
# (PRIVATE VM = NO PUBLIC IP)
############################################

resource "azurerm_network_interface" "app" {
  name                = "${var.project_name}-${var.environment}-app-nic"
  location            = var.location
  resource_group_name = var.resource_group_name
  tags                = var.tags

  ip_configuration {
    name                          = "internal"
    subnet_id                     = var.private_subnet_id
    private_ip_address_allocation = "Dynamic"
    # ❌ Removed public_ip_address_id — App VM must stay private
  }
}

############################################
# BASTION HOST VM
############################################

resource "azurerm_linux_virtual_machine" "bastion" {
  name                = "${var.project_name}-${var.environment}-bastion"
  resource_group_name = var.resource_group_name
  location            = var.location
  size                = var.vm_size
  admin_username      = var.admin_username
  tags                = var.tags

  network_interface_ids = [
    azurerm_network_interface.bastion.id,
  ]

  admin_ssh_key {
    username   = var.admin_username
    public_key = var.admin_ssh_public_key
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts-gen2"
    version   = "latest"
  }

  disable_password_authentication = true
}

############################################
# APPLICATION VM (PRIVATE)
############################################

resource "azurerm_linux_virtual_machine" "app" {
  name                = "${var.project_name}-${var.environment}-app"
  resource_group_name = var.resource_group_name
  location            = var.location
  size                = var.vm_size
  admin_username      = var.admin_username
  tags                = var.tags

  network_interface_ids = [
    azurerm_network_interface.app.id,
  ]

  admin_ssh_key {
    username   = var.admin_username
    public_key = var.admin_ssh_public_key
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts-gen2"
    version   = "latest"
  }

  disable_password_authentication = true
}
