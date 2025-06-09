@minLength(1)
@description('Location for Cosmos DB')
param location string

@description('Resource name for Cosmos DB account')
param cosmosDbAccountName string

@description('Tags for Cosmos DB resources')
param tags object = {}

resource cosmosDbAccount 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: cosmosDbAccountName
  location: location
  kind: 'MongoDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    locations: [
      {
        locationName: location
        failoverPriority: 0
      }
    ]
    apiProperties: {
      serverVersion: '4.2' // current supported MongoDB version
    }
    enableFreeTier: true // Optional: free tier (1st account only)
  }
  tags: tags
}

// Optional: Create database (next-auth will create collections)
resource mongoDatabase 'Microsoft.DocumentDB/databaseAccounts/mongodbDatabases@2023-04-15' = {
  name: '${cosmosDbAccount.name}/llamaindexdb'
  properties: {
    resource: {
      id: 'llamaindexdb'
    }
  }
}

output cosmosDbAccountName string = cosmosDbAccount.name
output cosmosDbAccountEndpoint string = cosmosDbAccount.properties.documentEndpoint
