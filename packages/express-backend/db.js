require('dotenv').config()
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas!");
    return { db: client.db('booktracker'), client };
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

module.exports = { connectDB };
