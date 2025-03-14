// test/features/databases/mongodb/databases.routes.test.ts
import request from 'supertest';
import express, { Express } from 'express';
import { setupMongoDatabasesRoutes } from './mongodb.routes';
import { MongoDatabaseController } from './mongodb.controller';
import { MongoDatabaseService } from './mongodb.service';
import { MongoClient, Db, Collection } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('MongoDB Routes', () => {
    let app: Express;
    let controller: MongoDatabaseController;
    let service: MongoDatabaseService;
    let client: MongoClient;
    let mongoServer: MongoMemoryServer;
    let db: Db;
    let collection: Collection;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        client = new MongoClient(uri);
        await client.connect();
        db = client.db('testdb');
        collection = db.collection('testcollection');
        service = new MongoDatabaseService(client);
        controller = new MongoDatabaseController(service);

        app = express();
        app.use(express.json());
        app.use(setupMongoDatabasesRoutes(controller));
    });

    afterAll(async () => {
        await client.close();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await collection.deleteMany({});
    });

    describe('POST /insertOne', () => {
        it('should insert a document', async () => {
            const res = await request(app)
                .post('/insertOne')
                .send({ database: 'testdb', collection: 'testcollection', document: { name: 'Test' } });
            expect(res.statusCode).toBe(201);
            expect(res.body.acknowledged).toBe(true);
        });
    });

    describe('POST /insertMany', () => {
        it('should insert many documents', async () => {
            const res = await request(app)
                .post('/insertMany')
                .send({ database: 'testdb', collection: 'testcollection', documents: [{ name: 'Test1' }, { name: 'Test2' }] });
            expect(res.statusCode).toBe(201);
            expect(res.body.insertedCount).toBe(2);
        });
    });

    describe('POST /deleteOne', () => {
        it('should delete a document', async () => {
            const inserted = await collection.insertOne({ name: 'Test' });
            const res = await request(app)
                .post('/deleteOne')
                .send({ database: 'testdb', collection: 'testcollection', id: inserted.insertedId.toHexString() });
            expect(res.statusCode).toBe(200);
            expect(res.body.deletedCount).toBe(1);
        });
    });

    describe('POST /updateOne', () => {
        it('should update a document', async () => {
            const inserted = await collection.insertOne({ name: 'Test' });
            const res = await request(app)
                .post('/updateOne')
                .send({ database: 'testdb', collection: 'testcollection', _id: inserted.insertedId.toHexString(), update: { $set: { name: 'Updated' } } });
            expect(res.statusCode).toBe(200);
            expect(res.body.modifiedCount).toBe(1);
        });
    });

    describe('POST /updateMany', () => {
        it('should update many documents', async () => {
            await collection.insertMany([{ name: 'Test1' }, { name: 'Test2' }]);
            const res = await request(app)
                .post('/updateMany')
                .send({ database: 'testdb', collection: 'testcollection', filter: {}, update: { $set: { name: 'Updated' } } });
            expect(res.statusCode).toBe(200);
            expect(res.body.modifiedCount).toBe(2);
        });
    });

    describe('POST /find', () => {
        it('should find documents', async () => {
            await collection.insertOne({ name: 'Test' });
            const res = await request(app)
                .post('/find')
                .send({ database: 'testdb', collection: 'testcollection', query: { name: 'Test' } });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(1);
        });

        it('should find one document by _id', async () => {
            const inserted = await collection.insertOne({ name: 'Test' });
            const res = await request(app)
                .post('/find')
                .send({ database: 'testdb', collection: 'testcollection', query: { _id: inserted.insertedId.toHexString() } });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('name', 'Test');
        });

        it('should find all documents', async () => {
            await collection.insertMany([{ name: 'Test1' }, { name: 'Test2' }]);
            const res = await request(app)
                .post('/find')
                .send({ database: 'testdb', collection: 'testcollection', query: 'all' });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(2);
        });
    });

    describe('POST /createDatabase', () => {
        it('should create a database', async () => {
            const res = await request(app)
                .post('/createDatabase')
                .send({ database: 'newdb' });
            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe('Database newdb created');
        });
    });

    describe('DELETE /deleteDatabase/:database', () => {
        it('should delete a database', async () => {
            await service.createDatabase('todelete');
            const res = await request(app)
                .delete('/deleteDatabase/todelete');
            expect(res.statusCode).toBe(204);
        });
    });

    describe('POST /createCollection', () => {
        it('should create a collection', async () => {
            const res = await request(app)
                .post('/createCollection')
                .send({ database: 'testdb', collection: 'newcollection' });
            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe('Collection newcollection created');
        });
    });

    describe('DELETE /deleteCollection/:database/:collection', () => {
        it('should delete a collection', async () => {
            await service.createCollection('testdb', 'todelete');
            const res = await request(app)
                .delete('/deleteCollection/testdb/todelete');
            expect(res.statusCode).toBe(204);
        });
    });
});