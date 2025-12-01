variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "location" {
  description = "Azure region"
  type        = string
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "database_subnet_id" {
  description = "ID of the database subnet"
  type        = string
}

variable "vnet_id" {
  description = "ID of the virtual network"
  type        = string
}

# REMOVED: private_subnet_prefix - no longer needed

variable "db_admin_username" {
  description = "Administrator username for database"
  type        = string
}

variable "db_admin_password" {
  description = "Administrator password for database"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "Name of the database"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
}