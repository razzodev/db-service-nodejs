// src/db/mongo.ts

import { MongoClient, Db, ServerApiVersion } from 'mongodb';

export const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydb'; // Replace with your connection string

export const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



export async function connectToDatabase(databaseName: string = ''): Promise<Db> {
    if (!databaseName) {
        throw new Error("database name required");
    }
    try {
        await client.connect();
        db = client.db(databaseName);
        console.log(`Connected to MongoDB database: ${databaseName}`);
        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error; // Re-throw to let the app handle it
    }
}

let db: Db;
export function getDb(): Db {
    if (!db) {
        throw new Error('Database connection not initialized. Call connectToDatabase() first.');
    }
    return db;
}

export async function closeDatabaseConnection(): Promise<void> {
    try {
        await client.close();
        console.log("MongoDB connection closed");
    } catch (error) {
        console.error("Error closing MongoDB connection:", error);
    }
}

const mongodb = {
    connectToDatabase,
    getDb,
    closeDatabaseConnection,
    client
};
export default mongodb