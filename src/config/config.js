import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(currentDirectory, "../..");
const environment = process.env.NODE_ENV || "development";
const environmentFile = path.join(projectDirectory, `.env.${environment}`);

const result = dotenv.config({ path: environmentFile });

if (result.error) {
  throw new Error(`Could not load ${path.basename(environmentFile)}: ${result.error.message}`);
}

const port = Number(process.env.PORT || 3000);
const dbUri = process.env.DB_URI?.trim();

if (!dbUri) {
  throw new Error(`DB_URI is empty in ${path.basename(environmentFile)}. Set a MongoDB connection string.`);
}

export const config = { environment, port, dbUri };
