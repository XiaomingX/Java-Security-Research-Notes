resource "azurerm_resource_group" "res-0" {
  location = "westeurope"
  name     = "generative-ai-poc"
  tags = {
    Owner = "Duncan Roosma"
  }
}
resource "azurerm_cognitive_account" "res-1" {
  custom_subdomain_name = "generative-ai-cognative-service"
  kind                  = "OpenAI"
  location              = "westeurope"
  name                  = "generative-ai-cognative-service"
  resource_group_name   = "generative-ai-poc"
  sku_name              = "S0"
  tags = {
    Owner = "Duncan Roosma"
  }
  network_acls {
    default_action = "Allow"
  }
  depends_on = [
    azurerm_resource_group.res-0,
  ]
}
resource "azurerm_cognitive_deployment" "res-2" {
  cognitive_account_id = "/subscriptions/f317d45c-55f5-4341-8d49-990b06d1c9a5/resourceGroups/generative-ai-poc/providers/Microsoft.CognitiveServices/accounts/generative-ai-cognative-service"
  name                 = "gpt-35-turbo"
  model {
    format  = "OpenAI"
    name    = "gpt-35-turbo"
    version = "0301"
  }
  scale {
    type = "Standard"
  }
  depends_on = [
    azurerm_cognitive_account.res-1,
  ]
}
resource "azurerm_cognitive_deployment" "res-3" {
  cognitive_account_id = "/subscriptions/f317d45c-55f5-4341-8d49-990b06d1c9a5/resourceGroups/generative-ai-poc/providers/Microsoft.CognitiveServices/accounts/generative-ai-cognative-service"
  name                 = "text-davinci-003"
  model {
    format  = "OpenAI"
    name    = "text-davinci-003"
    version = "1"
  }
  scale {
    type = "Standard"
  }
  depends_on = [
    azurerm_cognitive_account.res-1,
  ]
}
resource "azurerm_cognitive_deployment" "res-4" {
  cognitive_account_id = "/subscriptions/f317d45c-55f5-4341-8d49-990b06d1c9a5/resourceGroups/generative-ai-poc/providers/Microsoft.CognitiveServices/accounts/generative-ai-cognative-service"
  name                 = "text-embedding-ada-002"
  model {
    format  = "OpenAI"
    name    = "text-embedding-ada-002"
    version = "2"
  }
  scale {
    type = "Standard"
  }
  depends_on = [
    azurerm_cognitive_account.res-1,
  ]
}
resource "azurerm_cognitive_account" "res-5" {
  custom_subdomain_name = "generative-ai-poc"
  kind                  = "CognitiveServices"
  location              = "westeurope"
  name                  = "generative-ai-poc"
  resource_group_name   = "generative-ai-poc"
  sku_name              = "S0"
  tags = {
    Owner = "Duncan Roosma"
  }
  network_acls {
    default_action = "Allow"
  }
  depends_on = [
    azurerm_resource_group.res-0,
  ]
}
resource "azurerm_storage_account" "res-6" {
  account_replication_type = "LRS"
  account_tier             = "Standard"
  location                 = "westeurope"
  name                     = "generativeaipersistance"
  resource_group_name      = "generative-ai-poc"
  tags = {
    Owner = "Duncan Roosma"
  }
  depends_on = [
    azurerm_resource_group.res-0,
  ]
}
resource "azurerm_storage_container" "res-8" {
  name                 = "ingestion-documents"
  storage_account_name = "generativeaipersistance"
}
resource "azurerm_storage_container" "res-9" {
  name                 = "json-documents"
  storage_account_name = "generativeaipersistance"
}
resource "azurerm_storage_container" "res-10" {
  name                 = "vector-documents"
  storage_account_name = "generativeaipersistance"
}
resource "azurerm_storage_account" "res-14" {
  account_kind                    = "Storage"
  account_replication_type        = "LRS"
  account_tier                    = "Standard"
  default_to_oauth_authentication = true
  location                        = "westeurope"
  name                            = "generativeaipocacd8"
  resource_group_name             = "generative-ai-poc"
  tags = {
    Owner = "Duncan Roosma"
  }
  depends_on = [
    azurerm_resource_group.res-0,
  ]
}
resource "azurerm_storage_container" "res-16" {
  name                 = "azure-webjobs-hosts"
  storage_account_name = "generativeaipocacd8"
}
resource "azurerm_storage_container" "res-17" {
  name                 = "azure-webjobs-secrets"
  storage_account_name = "generativeaipocacd8"
}
resource "azurerm_storage_container" "res-18" {
  name                 = "scm-releases"
  storage_account_name = "generativeaipocacd8"
}
resource "azurerm_storage_share" "res-20" {
  name                 = "generative-ai-poc-python9244"
  quota                = 5120
  storage_account_name = "generativeaipocacd8"
}
resource "azurerm_service_plan" "res-23" {
  location            = "westeurope"
  name                = "ASP-generativeaipoc-a6aa"
  os_type             = "Linux"
  resource_group_name = "generative-ai-poc"
  sku_name            = "Y1"
  tags = {
    Owner = "Duncan Roosma"
  }
  depends_on = [
    azurerm_resource_group.res-0,
  ]
}
resource "azurerm_linux_function_app" "res-24" {
  builtin_logging_enabled    = false
  client_certificate_mode    = "Required"
  https_only                 = true
  location                   = "westeurope"
  name                       = "generative-ai-poc-python"
  resource_group_name        = "generative-ai-poc"
  service_plan_id            = "/subscriptions/f317d45c-55f5-4341-8d49-990b06d1c9a5/resourceGroups/generative-ai-poc/providers/Microsoft.Web/serverfarms/ASP-generativeaipoc-a6aa"
  storage_account_access_key = "***REMOVED***"
  storage_account_name       = "generativeaipocacd8"
  tags = {
    Owner                                            = "Duncan Roosma"
    "hidden-link: /app-insights-conn-string"         = "InstrumentationKey=de1f16ef-4d16-4093-8130-d2f1d618b50f;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/;LiveEndpoint=https://westeurope.livediagnostics.monitor.azure.com/"
    "hidden-link: /app-insights-instrumentation-key" = "de1f16ef-4d16-4093-8130-d2f1d618b50f"
    "hidden-link: /app-insights-resource-id"         = "/subscriptions/f317d45c-55f5-4341-8d49-990b06d1c9a5/resourceGroups/generative-ai-poc/providers/microsoft.insights/components/generative-ai-poc-python"
  }
  site_config {
    application_insights_connection_string = "InstrumentationKey=de1f16ef-4d16-4093-8130-d2f1d618b50f;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/;LiveEndpoint=https://westeurope.livediagnostics.monitor.azure.com/"
    application_insights_key               = "de1f16ef-4d16-4093-8130-d2f1d618b50f"
    ftps_state                             = "FtpsOnly"
    application_stack {
      python_version = "3.10"
    }
    cors {
      allowed_origins = ["https://portal.azure.com"]
    }
  }
  depends_on = [
    azurerm_service_plan.res-23,
  ]
}
resource "azurerm_function_app_function" "res-28" {
  config_json     = "{\"bindings\":[{\"connection\":\"AzureWebJobsStorage\",\"direction\":\"in\",\"name\":\"document\",\"path\":\"ingestion-documents/{name}\",\"type\":\"blobTrigger\"}]}"
  function_app_id = "/subscriptions/f317d45c-55f5-4341-8d49-990b06d1c9a5/resourceGroups/generative-ai-poc/providers/Microsoft.Web/sites/generative-ai-poc-python"
  name            = "convert-to-markdown"
  depends_on = [
    azurerm_linux_function_app.res-24,
  ]
}
resource "azurerm_app_service_custom_hostname_binding" "res-29" {
  app_service_name    = "generative-ai-poc-python"
  hostname            = "generative-ai-poc-python.azurewebsites.net"
  resource_group_name = "generative-ai-poc"
  depends_on = [
    azurerm_linux_function_app.res-24,
  ]
}
resource "azurerm_application_insights" "res-30" {
  application_type    = "web"
  location            = "westeurope"
  name                = "generative-ai-poc-python"
  resource_group_name = "generative-ai-poc"
  sampling_percentage = 0
  tags = {
    Owner = "Duncan Roosma"
  }
  workspace_id = "/subscriptions/f317d45c-55f5-4341-8d49-990b06d1c9a5/resourceGroups/defaultresourcegroup-weu/providers/Microsoft.OperationalInsights/workspaces/defaultworkspace-f317d45c-55f5-4341-8d49-990b06d1c9a5-weu"
  depends_on = [
    azurerm_resource_group.res-0,
  ]
}
