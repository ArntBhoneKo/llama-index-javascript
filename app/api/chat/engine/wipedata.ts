import { BlobServiceClient } from "@azure/storage-blob";
import * as fs from "fs/promises";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function clearLocalPersistDir(persistDir: string) {
  const files = await fs.readdir(persistDir);
  for (const file of files) {
    const filePath = path.join(persistDir, file);
    await fs.unlink(filePath);
    console.log(`Deleted local file: ${file}`);
  }
}

async function clearAzureBlobContainer() {
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || "llama-index-data";
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING!
  );
  const containerClient = blobServiceClient.getContainerClient(containerName);

  for await (const blob of containerClient.listBlobsFlat()) {
    const blockBlobClient = containerClient.getBlockBlobClient(blob.name);
    await blockBlobClient.delete();
    console.log(`Deleted blob: ${blob.name}`);
  }
}

export async function wipeAllData() {
  const persistDir = process.env.STORAGE_CACHE_DIR;
  if (!persistDir) throw new Error("STORAGE_CACHE_DIR environment variable is required!");

  console.log("Wiping local storage directory...");
  await clearLocalPersistDir(persistDir);

  console.log("Wiping Azure Blob container...");
  await clearAzureBlobContainer();

  console.log("✅ All data successfully wiped.");
}

// Run directly if this file is executed
if (require.main === module) {
  wipeAllData().catch((err) => {
    console.error("Failed to wipe data:", err);
    process.exit(1);
  });
}
