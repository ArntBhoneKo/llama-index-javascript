param name string
param location string = resourceGroup().location
param tags object = {}

@description('Service principal that should be granted read access to the KeyVault. If unset, no service principal is granted access by default')
param principalId string = ''

@secure()
@description('Google OAuth Client ID')
param googleClientId string = ''

@secure()
@description('Google OAuth Client Secret')
param googleClientSecret string = ''

@secure()
@description('Cosmos DB admin password (optional). Only set to store it in KeyVault.')
param cosmosDbPassword string = ''

var defaultAccessPolicies = !empty(principalId) ? [
  {
    objectId: principalId
    permissions: { secrets: [ 'get', 'list' ] }
    tenantId: subscription().tenantId
  }
] : []

resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' = {
  name: name
  location: location
  tags: tags
  properties: {
    tenantId: subscription().tenantId
    sku: { family: 'A', name: 'standard' }
    enabledForTemplateDeployment: true
    accessPolicies: union(defaultAccessPolicies, [
      // additional access policies if needed
    ])
  }
}

@description('Cosmos DB admin password secret')
resource cosmosDbPasswordSecret 'Microsoft.KeyVault/vaults/secrets@2022-07-01' = if (!empty(cosmosDbPassword)) {
  parent: keyVault
  name: 'cosmosDbPassword'
  properties: {
    value: cosmosDbPassword
  }
}

@description('Google OAuth Client ID secret')
resource googleClientIdSecret 'Microsoft.KeyVault/vaults/secrets@2022-07-01' = if (!empty(googleClientId)) {
  parent: keyVault
  name: 'GOOGLE_CLIENT_ID'
  properties: {
    value: googleClientId
  }
}

@description('Google OAuth Client Secret secret')
resource googleClientSecretSecret 'Microsoft.KeyVault/vaults/secrets@2022-07-01' = if (!empty(googleClientSecret)) {
  parent: keyVault
  name: 'GOOGLE_CLIENT_SECRET'
  properties: {
    value: googleClientSecret
  }
}

output name string = keyVault.name
output endpoint string = keyVault.properties.vaultUri
output cosmosDbPassword string = empty(cosmosDbPassword) ? '' : cosmosDbPassword
output googleClientIdSecretValue string = empty(googleClientId) ? '' : googleClientIdSecret.properties.value
output googleClientSecretSecretValue string = empty(googleClientSecret) ? '' : googleClientSecretSecret.properties.value
