terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "3.55.0"
    }
  }
  backend "azurerm" {
    resource_group_name  = "rg-generative-ai-poc-terraformstate"
    storage_account_name = "terraformpersistance"
    container_name       = "terraform-state"
    key                  = "terraform.tfstate"
  }
}

provider "azurerm" {
  features {}
}