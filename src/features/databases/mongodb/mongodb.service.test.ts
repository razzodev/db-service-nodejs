import { MongoClient, Db, Collection, InsertOneResult, InsertManyResult, DeleteResult, UpdateResult, UpdateOptions } from 'mongodb';
import { MongoDatabaseService } from './mongodb.service';
import { InMemoryCacheService } from '../../../services/cache';;
import { MongoMemoryServer } from 'mongodb-memory-server'; // Import

describe('MongoDatabaseService', () => {
    let db: Db;
    let collection: Collection;
    let service: MongoDatabaseService;
    let client: MongoClient;
    let mongoServer: MongoMemoryServer; // Declare server

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create(); // Start server
        const uri = mongoServer.getUri(); // Get URI
        client = new MongoClient(uri);
        await client.connect();
        db = client.db('testdb');
        collection = db.collection('testcollection');
        service = new MongoDatabaseService(client);
    });

    afterAll(async () => {
        await client.close();
        await mongoServer.stop(); // Stop server
    });

    beforeEach(async () => {
        await collection.deleteMany({});
    });

    describe('createDatabase', () => {
        it('should create a database', async () => {
            const dbName = 'newdb';
            const createdDb = await service.createDatabase(dbName);
            expect(createdDb.databaseName).toBe(dbName);
        });
    });

    describe('deleteDatabase', () => {
        it('should delete a database', async () => {
            const dbName = 'todelete';
            await service.createDatabase(dbName);
            await service.deleteDatabase(dbName);
            const databases = await db.listCollections().toArray();
            expect(databases.map(col => col.name)).not.toContain(dbName);
        });
    });

    describe('createCollection', () => {
        it('should create a collection', async () => {
            const collectionName = 'newcollection';
            const createdCollection = await service.createCollection('testdb', collectionName);
            expect(createdCollection.collectionName).toBe(collectionName);
        });
    });

    describe('deleteCollection', () => {
        it('should delete a collection', async () => {
            const collectionName = 'todelete';
            await service.createCollection('testdb', collectionName);
            await service.deleteCollection('testdb', collectionName);
            const collections = await db.listCollections().toArray();
            expect(collections.map(col => col.name)).not.toContain(collectionName);
        });
    });

    describe('find', () => {
        it('should find documents in a collection', async () => {
            const doc = { name: 'John Doe' };
            await collection.insertOne(doc);
            const result = await service.find('testdb', 'testcollection', { name: 'John Doe' });
            expect(result).toContainEqual(doc);
        });
    });

    describe('findAll', () => {
        it('should find all documents in a collection', async () => {
            const docs = [{ name: 'John Doe' }, { name: 'Jane Doe' }];
            await collection.insertMany(docs);
            const result = await service.findAll('testdb', 'testcollection');
            expect(result).toEqual(docs);
        });
    });

    describe('findOne', () => {
        it('should find one document in a collection', async () => {
            const doc = { name: 'John Doe' };
            await collection.insertOne(doc);
            const result = await service.findOne('testdb', 'testcollection', { name: 'John Doe' });
            expect(result).toEqual(doc);
        });
    });

    describe('insertOne', () => {
        it('should insert one document into a collection', async () => {
            const doc = { name: 'John Doe' };
            const result = await service.insertOne('testdb', 'testcollection', doc);
            expect(result.acknowledged).toBe(true);
            const insertedDoc = await collection.findOne({ _id: result.insertedId });
            expect(insertedDoc).toEqual(doc);
        });
    });

    describe('insertMany', () => {
        it('should insert many documents into a collection', async () => {
            const docs = [{ name: 'John Doe' }, { name: 'Jane Doe' }];
            const result = await service.insertMany('testdb', 'testcollection', docs);
            expect(result.insertedCount).toBe(2);
            const insertedDocs = await collection.find({}).toArray();
            expect(insertedDocs).toEqual(docs);
        });
    });

    describe('updateOne', () => {
        it('should update one document in a collection', async () => {
            const doc = { name: 'John Doe' };
            await collection.insertOne(doc);
            const result = await service.updateOne('testdb', 'testcollection', { name: 'John Doe' }, { $set: { name: 'Jane Doe' } });
            expect(result.modifiedCount).toBe(1);
            const updatedDoc = await collection.findOne({ name: 'Jane Doe' });
            expect(updatedDoc).toEqual({ ...doc, name: 'Jane Doe' });
        });
    });

    describe('updateMany', () => {
        it('should update many documents in a collection', async () => {
            const docs = [{ name: 'John Doe' }, { name: 'Jane Doe' }];
            await collection.insertMany(docs);
            const result = await service.updateMany('testdb', 'testcollection', {}, { $set: { name: 'Updated Name' } });
            expect(result.modifiedCount).toBe(2);
            const updatedDocs = await collection.find({}).toArray();
            expect(updatedDocs).toEqual([{ _id: expect.any(Object), name: 'Updated Name' }, { _id: expect.any(Object), name: 'Updated Name' }]);
        });
    });

    describe('deleteOne', () => {
        it('should delete one document from a collection', async () => {
            const doc = { name: 'John Doe' };
            await collection.insertOne(doc);
            const result = await service.deleteOne('testdb', 'testcollection', { name: 'John Doe' });
            expect(result.deletedCount).toBe(1);
            const remainingDocs = await collection.find({}).toArray();
            expect(remainingDocs.length).toBe(0);
        });
    });

    describe('deleteMany', () => {
        it('should delete many documents from a collection', async () => {
            const docs = [{ name: 'John Doe' }, { name: 'Jane Doe' }];
            await collection.insertMany(docs);
            const result = await service.deleteMany('testdb', 'testcollection', {});
            expect(result.deletedCount).toBe(2);
            const remainingDocs = await collection.find({}).toArray();
            expect(remainingDocs.length).toBe(0);
        });
    });
});