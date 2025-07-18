targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the environment that can be used as part of naming resource convention')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string

@description('Whether the deployment is running on GitHub Actions')
param runningOnGh string = ''

param llamaIndexNextjsExists bool
@secure()
param llamaIndexNextjsDefinition object

@description('Id of the user or app to assign application roles')
param principalId string

param openAiLocation string // Set in main.parameters.json
param openAiSkuName string = 'S0' // Set in main.parameters.json
param openAiUrl string = '' // Set in main.parameters.json
param openAiApiVersion string // Set in main.parameters.json

@secure()
param googleClientId string = ''
@secure()
param googleClientSecret string = ''

var finalOpenAiUrl = empty(openAiUrl) ? 'https://${openAi.outputs.name}.openai.azure.com' : openAiUrl

var llamaIndexConfig = {
  chat: {
    model: 'gpt-4o-mini'
    deployment: 'gpt-4o-mini'
    version: '2024-07-18'
    capacity: '10'
  }
  embedding: {
    model: 'text-embedding-3-large'
    deployment: 'text-embedding-3-large'
    dim: '1024'
    capacity: '10'
  }
  model_provider: 'openai'
  openai_api_key: ''
  llm_temperature: '0.7'
  llm_max_tokens: '8000'
  top_k: '3'
  fileserver_url_prefix: 'http://localhost/api/files'
  system_prompt: 'You are a professional, friendly, and knowledgeable customer support assistant. Communicate clearly, helpfully, and with empathy. Respond in Burmese if the customer writes in Burmese; otherwise, respond in English. Always maintain a respectful and courteous tone appropriate for high-quality customer service.'
}

// Tags that should be applied to all resources.
// 
// Note that 'azd-service-name' tags should be applied separately to service host resources.
// Example usage:
//   tags: union(tags, { 'azd-service-name': <service name in azure.yaml> })
var tags = {
  'azd-env-name': environmentName
}

var abbrs = loadJsonContent('./abbreviations.json')
var resourceToken = toLower(uniqueString(subscription().id, environmentName, location))

resource rg 'Microsoft.Resources/resourceGroups@2022-09-01' = {
  name: 'rg-${environmentName}'
  location: location
  tags: tags
}

module monitoring './shared/monitoring.bicep' = {
  name: 'monitoring'
  params: {
    location: location
    tags: tags
    logAnalyticsName: '${abbrs.operationalInsightsWorkspaces}${resourceToken}'
    applicationInsightsName: '${abbrs.insightsComponents}${resourceToken}'
  }
  scope: rg
}

module dashboard './shared/dashboard-web.bicep' = {
  name: 'dashboard'
  params: {
    name: '${abbrs.portalDashboards}${resourceToken}'
    applicationInsightsName: monitoring.outputs.applicationInsightsName
    location: location
    tags: tags
  }
  scope: rg
}

module registry './shared/registry.bicep' = {
  name: 'registry'
  params: {
    location: location
    tags: tags
    name: '${abbrs.containerRegistryRegistries}${resourceToken}'
  }
  scope: rg
}

module keyVault './shared/keyvault.bicep' = {
  name: 'keyvault'
  params: {
    location: location
    tags: tags
    name: '${abbrs.keyVaultVaults}${resourceToken}'
    principalId: principalId
  }
  scope: rg
}

module appsEnv './shared/apps-env.bicep' = {
  name: 'apps-env'
  params: {
    name: '${abbrs.appManagedEnvironments}${resourceToken}'
    location: location
    tags: tags
    applicationInsightsName: monitoring.outputs.applicationInsightsName
    logAnalyticsWorkspaceName: monitoring.outputs.logAnalyticsWorkspaceName
  }
  scope: rg
}

module storage './shared/storage.bicep' = {
  name: 'storage'
  scope: rg
  params: {
    location: location
    storageAccountName: '${abbrs.storageStorageAccounts}${resourceToken}'
  }
}

module openAi './shared/cognitiveservices.bicep' = if (empty(openAiUrl)) {
  name: 'openai'
  scope: rg
  params: {
    name: '${abbrs.cognitiveServicesAccounts}${resourceToken}'
    location: openAiLocation
    tags: tags
    sku: {
      name: openAiSkuName
    }
    disableLocalAuth: true
    deployments: [
      {
        name: llamaIndexConfig.chat.deployment
        model: {
          format: 'OpenAI'
          name: llamaIndexConfig.chat.model
          version: llamaIndexConfig.chat.version
        }
        sku: {
          name: 'Standard'
          capacity: llamaIndexConfig.chat.capacity
        }
      }
      {
        name: llamaIndexConfig.embedding.model
        model: {
          format: 'OpenAI'
          name: llamaIndexConfig.embedding.deployment
        }
        capacity: llamaIndexConfig.embedding.capacity
      }
    ]
  }
}

module llamaIndexNextjs './app/llama-index-nextjs.bicep' = {
  name: 'llama-index-nextjs'
  params: {
    name: '${abbrs.appContainerApps}llama-index-${resourceToken}'
    location: location
    tags: tags
    runningOnGh: runningOnGh
    identityName: '${abbrs.managedIdentityUserAssignedIdentities}llama-index-${resourceToken}'
    applicationInsightsName: monitoring.outputs.applicationInsightsName
    containerAppsEnvironmentName: appsEnv.outputs.name
    containerRegistryName: registry.outputs.name
    exists: llamaIndexNextjsExists
    principalId: principalId
    appDefinition: union(llamaIndexNextjsDefinition, {
      settings: [
        {
          name: 'AZURE_KEY_VAULT_NAME' 
          value: keyVault.outputs.name
        }
        {
          name: 'AZURE_KEY_VAULT_ENDPOINT' 
          value: keyVault.outputs.endpoint
        }
        {
          name: 'AZURE_OPENAI_ENDPOINT' 
          value: finalOpenAiUrl
        }
        {
          name: 'AZURE_DEPLOYMENT_NAME' 
          value: llamaIndexConfig.chat.deployment
        }
        {
          name: 'OPENAI_API_VERSION' 
          value: openAiApiVersion
        }
        {
          name: 'MODEL_PROVIDER' 
          value: llamaIndexConfig.model_provider
        }
        {
          name: 'MODEL' 
          value: llamaIndexConfig.chat.model
        }
        {
          name: 'EMBEDDING_MODEL' 
          value: llamaIndexConfig.embedding.model
        }
        {
          name: 'EMBEDDING_DIM' 
          value: llamaIndexConfig.embedding.dim
        }
        {
          name: 'LLM_TEMPERATURE' 
          value: llamaIndexConfig.llm_temperature
        }
        {
          name: 'LLM_MAX_TOKENS' 
          value: llamaIndexConfig.llm_max_tokens
        }
        {
          name: 'TOP_K' 
          value: llamaIndexConfig.top_k
        }
        {
          name: 'FILESERVER_URL_PREFIX' 
          value: llamaIndexConfig.fileserver_url_prefix
        }
        {
          name: 'SYSTEM_PROMPT' 
          value: llamaIndexConfig.system_prompt
        }
        {
          name: 'CONVERSATION_STARTERS'
          value: 'Can you help me get a residence card and register at city hall?\nCan you show me how to open a bank account or get a SIM card?\nCan you help me find a cheap apartment or share house?\nCan you explain how to use trains, buses, and buy IC cards?\nCan you teach me useful Japanese phrases for daily life?\nCan you help me find jobs or part-time work in Japan?'
        }
        {
          name: 'OPENAI_API_TYPE'
          value: 'AzureOpenAI'
        }
        {
          name: 'STORAGE_CACHE_DIR'
          value: './cache'
        }
        {
          name: 'AZURE_STORAGE_CONNECTION_STRING'
          value: storage.outputs.storageAccountConnectionString
        }
        {
          name: 'AZURE_STORAGE_CONTAINER_NAME'
          value: 'llama-index-data'
        }
        {
          name: 'SCRAPER_API_URL'
          value: 'https://llama-web-scraper.azurewebsites.net/scrape'
        }
        {
          name: 'NEXTAUTH_URL'
          value: 'https://${abbrs.appContainerApps}llama-index-${resourceToken}.${appsEnv.outputs.domain}'
        }
        {
          name: 'NEXTAUTH_SECRET'
          value: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6'
        }
        {
          name: 'GOOGLE_CLIENT_ID'
          value: googleClientId
        }
        {
          name: 'GOOGLE_CLIENT_SECRET'
          value: googleClientSecret
        }
      ]
    })
  }
  scope: rg
}

output AZURE_CONTAINER_REGISTRY_ENDPOINT string = registry.outputs.loginServer
output AZURE_KEY_VAULT_NAME string = keyVault.outputs.name
output AZURE_KEY_VAULT_ENDPOINT string = keyVault.outputs.endpoint

output AZURE_OPENAI_ENDPOINT string = finalOpenAiUrl
output AZURE_DEPLOYMENT_NAME string = llamaIndexConfig.chat.deployment
output OPENAI_API_VERSION string = openAiApiVersion

//  LlamaIndex configuration
output MODEL_PROVIDER string = llamaIndexConfig.model_provider
output MODEL string = llamaIndexConfig.chat.model
output EMBEDDING_MODEL string = llamaIndexConfig.embedding.model
output EMBEDDING_DIM string = llamaIndexConfig.embedding.dim
output OPENAI_API_KEY string = llamaIndexConfig.openai_api_key
output LLM_TEMPERATURE string = llamaIndexConfig.llm_temperature
output LLM_MAX_TOKENS string = llamaIndexConfig.llm_max_tokens
output TOP_K string = llamaIndexConfig.top_k
output FILESERVER_URL_PREFIX string = llamaIndexConfig.fileserver_url_prefix
output SYSTEM_PROMPT string = llamaIndexConfig.system_prompt
output OPENAI_API_TYPE string = 'AzureOpenAI'
output STORAGE_CACHE_DIR string = './cache'
output AZURE_STORAGE_CONNECTION_STRING string = storage.outputs.storageAccountConnectionString
output AZURE_STORAGE_CONTAINER_NAME string = 'llama-index-data'
output SCRAPER_API_URL string = 'https://llama-web-scraper.azurewebsites.net/scrape'
output CONVERSATION_STARTERS string = 'Can you help me get a residence card and register at city hall?\nCan you show me how to open a bank account or get a SIM card?\nCan you help me find a cheap apartment or share house?\nCan you explain how to use trains, buses, and buy IC cards?\nCan you teach me useful Japanese phrases for daily life?\nCan you help me find jobs or part-time work in Japan?'