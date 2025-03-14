import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const uri = await mongoServer.getUri();
    const client = new MongoClient(uri);
    await client.connect();
    global.client = client;
});

afterAll(async () => {
    if (global.client) {
        await global.client.close();
    }
    if (mongoServer) {
        await mongoServer.stop();
    }
});