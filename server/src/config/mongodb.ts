
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is not defined");
}

const client = new MongoClient(mongoUri);

const database = client.db("kindora");

export { client, database };
