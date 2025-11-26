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
}

variable "allowed_ssh_source_ip" {
  description = "Your IP address for SSH access to bastion (use 0.0.0.0/0 temporarily)"
  type        = string
  default     = "0.0.0.0/0"
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
}

variable "db_name" {
  description = "Name of the database"
  type        = string
  default     = "agriconnect_db"
}

variable "vm_size" {
  description = "Size of the VMs"
  type        = string
  default     = "Standard_B1s"
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