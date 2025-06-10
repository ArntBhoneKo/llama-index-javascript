@description('Location for Cosmos DB Mongo Cluster')
param location string

@description('Name of the Cosmos DB Mongo Cluster')
param mongoClusterName string

@description('Tags for resources')
param tags object = {}

@description('Admin username for MongoDB cluster')
param mongoAdminUsername string = 'llamaindexuser'

@secure()
@description('Admin password for MongoDB cluster')
param mongoAdminPassword string

resource cosmosDbMongoCluster 'Microsoft.DocumentDB/mongoClusters@2024-03-01-preview' = {
  name: mongoClusterName
  location: location
  sku: {
    name: 'GeneralPurpose'
    tier: 'GeneralPurpose'
  }
  properties: {
    administratorLogin: mongoAdminUsername
    administratorLoginPassword: mongoAdminPassword
    nodeGroupSpecs: [
      {
        kind: 'Shard'
        nodeCount: 3
        sku: 'M30'          // Choose M30, M40, M50 based on region & cost
        enableHa: true
        diskSizeGB: 128     // Minimum disk size per node
      }
    ]
  }
  tags: tags
}

output cosmosDbMongoConnectionHost string = '${cosmosDbMongoCluster.name}.mongo.cosmos.azure.com'
output cosmosDbAdminUsername string = cosmosDbMongoCluster.properties.administratorLogin
output cosmosDbAdminPassword string = mongoAdminPassword
