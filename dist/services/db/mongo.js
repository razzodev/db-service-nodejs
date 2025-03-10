"use strict";
// src/db/mongo.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uri = void 0;
exports.connectToDatabase = connectToDatabase;
exports.getDb = getDb;
exports.closeDatabaseConnection = closeDatabaseConnection;
const mongodb_1 = require("mongodb");
exports.uri = process.env.MONGODB_URI || 'mongodb://user:pass@localhost:27017/mydb'; // Replace with your connection string
const client = new mongodb_1.MongoClient(exports.uri, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
function getClient() {
    return client;
}
function connectToDatabase() {
    return __awaiter(this, arguments, void 0, function* (databaseName = '') {
        try {
            yield client.connect();
            db = client.db(databaseName);
            console.log('Connected to MongoDB');
            return db;
        }
        catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw error; // Re-throw to let the app handle it
        }
    });
}
let db;
function getDb() {
    if (!db) {
        throw new Error('Database connection not initialized. Call connectToDatabase() first.');
    }
    return db;
}
function closeDatabaseConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.close();
            console.log("MongoDB connection closed");
        }
        catch (error) {
            console.error("Error closing MongoDB connection:", error);
        }
    });
}
const mongodb = {
    connectToDatabase,
    getDb,
    closeDatabaseConnection,
    getClient
};
exports.default = mongodb;
