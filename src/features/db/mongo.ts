// src/db/mongo.ts

import { MongoClient, Db, ServerApiVersion } from 'mongodb';

export const uri = process.env.MONGODB_URI || 'mongodb://user:pass@localhost:27017/mydb'; // Replace with your connection string

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
let db: Db;

export async function connectToDatabase(databaseName: string = ''): Promise<Db> {
    try {
        await client.connect();
        db = client.db(databaseName);
        console.log('Connected to MongoDB');
        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error; // Re-throw to let the app handle it
    }
}

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
};
export default mongodb