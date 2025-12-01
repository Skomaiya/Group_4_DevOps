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

variable "vnet_address_space" {
  description = "Address space for VNet"
  type        = list(string)
  default     = ["10.0.0.0/16"]
}

variable "public_subnet_prefix" {
  description = "Address prefix for public subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "private_subnet_prefix" {
  description = "Address prefix for private subnet"
  type        = string
  default     = "10.0.2.0/24"
}

variable "database_subnet_prefix" {
  description = "Address prefix for database subnet"
  type        = string
  default     = "10.0.3.0/24"
}

variable "allowed_ssh_source_ip" {
  description = "Allowed source IP for SSH to bastion"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
}