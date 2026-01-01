import { MongoClient } from "mongodb";

const MONGO_URL = process.env.MONGO_URL || "mongodb://admin:password123@localhost:27018/usersDb?authSource=admin";
const DB_NAME = "usresDb";
const COLLECTION_NAME = "users"

let mongocClient = null;
let mongoConn = null;

export async function initMongoDb() {
  try {
    mongocClient = new MongoClient(MONGO_URL);
    await mongocClient.connect();
    mongoConn = mongocClient.db(DB_NAME);
    
    const usersCollection = mongoConn.collection(COLLECTION_NAME);
    await usersCollection.createIndex({ username: 1 }, { unique: true });
    
    console.log("Database initialized and unique index created on 'usrename' field");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  } 
}

export async function getMongoDb() {
  if (!mongoConn) {
    if (!mongocClient) {
      mongocClient = new MongoClient(MONGO_URL);
      await mongocClient.connect();
    }
    mongoConn = mongocClient.db(DB_NAME);
  }
  return mongoConn;
}
