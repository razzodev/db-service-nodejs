import { MongoClient, Db, Collection, InsertOneResult, InsertManyResult, DeleteResult, UpdateResult, UpdateOptions } from 'mongodb';
import { MongoDatabaseService } from './mongodb.service';
import { InMemoryCacheService, getCachedOrExecute } from '../../../services/cache'; // Import
import { MongoMemoryServer } from 'mongodb-memory-server'; // Import
import * as cacheUtils from '../../../services/cache/cacheUtils';

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

        it('should invalidate cache after deleteDatabase', async () => {
            const dbName = 'todelete';
            await service.createDatabase(dbName);
            await service.findOne(dbName, 'testcollection', { name: 'John Doe' }); // Populate cache
            await service.deleteDatabase(dbName);
            expect(service['cacheService'].getKeys().filter(key => key.startsWith(`${dbName}:`)).length).toBe(0);
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

        it('should invalidate cache after deleteCollection', async () => {
            const collectionName = 'todelete';
            await service.createCollection('testdb', collectionName);
            await service.findOne('testdb', collectionName, { name: 'John Doe' }); // Populate cache
            await service.deleteCollection('testdb', collectionName);
            expect(service['cacheService'].getKeys().filter(key => key.includes(`testdb:${collectionName}`)).length).toBe(0);
        });
    });

    describe('find', () => {
        it('should find documents in a collection', async () => {
            const doc = { name: 'John Doe' };
            await collection.insertOne(doc);
            const result = await service.find('testdb', 'testcollection', { name: 'John Doe' });
            expect(result).toContainEqual(doc);
        });

        it('should return cached result on second call', async () => {
            const cacheKey = `find:testdb:testcollection:${JSON.stringify({ name: 'John Doe' })}`;
            await service.find('testdb', 'testcollection', { name: 'John Doe' });
            const cachedResult = service['cacheService'].get(cacheKey);
            expect(cachedResult).toBeDefined();

            const result = await service.find('testdb', 'testcollection', { name: 'John Doe' });
            expect(result).toEqual(cachedResult);
        });
    });

    describe('findAll', () => {
        it('should find all documents in a collection', async () => {
            const docs = [{ name: 'John Doe' }, { name: 'Jane Doe' }];
            await collection.insertMany(docs);
            const result = await service.findAll('testdb', 'testcollection');
            expect(result).toEqual(docs);
        });

        it('should return cached result on second call', async () => {
            const cacheKey = `findAll:testdb:testcollection`;
            await service.findAll('testdb', 'testcollection');
            const cachedResult = service['cacheService'].get(cacheKey);
            expect(cachedResult).toBeDefined();

            const result = await service.findAll('testdb', 'testcollection');
            expect(result).toEqual(cachedResult);
        });
    });

    describe('findOne', () => {
        it('should find one document in a collection', async () => {
            const doc = { name: 'John Doe' };
            await collection.insertOne(doc);
            const result = await service.findOne('testdb', 'testcollection', { name: 'John Doe' });
            expect(result).toEqual(doc);
        });

        it('should return cached result on second call', async () => {
            const cacheKey = `findOne:testdb:testcollection:${JSON.stringify({ name: 'John Doe' })}`;
            await service.findOne('testdb', 'testcollection', { name: 'John Doe' });
            const cachedResult = service['cacheService'].get(cacheKey);
            expect(cachedResult).toBeDefined();

            const result = await service.findOne('testdb', 'testcollection', { name: 'John Doe' });
            expect(result).toEqual(cachedResult);
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

        it('should invalidate cache after insertOne', async () => {
            const doc = { name: 'John Doe' };
            await service.findOne('testdb', 'testcollection', { name: 'John Doe' }); // Populate cache
            await service.insertOne('testdb', 'testcollection', doc);
            const cacheKey = `findOne:testdb:testcollection:${JSON.stringify({ name: 'John Doe' })}`;
            expect(service['cacheService'].get(cacheKey)).toBeUndefined();
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

        it('should invalidate cache after insertMany', async () => {
            const docs = [{ name: 'John Doe' }, { name: 'Jane Doe' }];
            await service.findOne('testdb', 'testcollection', { name: 'John Doe' }); // Populate cache
            await service.insertMany('testdb', 'testcollection', docs);
            const cacheKey = `findOne:testdb:testcollection:${JSON.stringify({ name: 'John Doe' })}`;
            expect(service['cacheService'].get(cacheKey)).toBeUndefined();
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

        it('should invalidate cache after updateOne', async () => {
            const doc = { name: 'John Doe' };
            await collection.insertOne(doc);
            await service.findOne('testdb', 'testcollection', { name: 'John Doe' }); // Populate cache
            await service.updateOne('testdb', 'testcollection', { name: 'John Doe' }, { $set: { name: 'Jane Doe' } });
            const cacheKey = `findOne:testdb:testcollection:${JSON.stringify({ name: 'John Doe' })}`;
            expect(service['cacheService'].get(cacheKey)).toBeUndefined();
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

        it('should invalidate cache after updateMany', async () => {
            const docs = [{ name: 'John Doe' }, { name: 'Jane Doe' }];
            await collection.insertMany(docs);
            await service.findOne('testdb', 'testcollection', { name: 'John Doe' }); // Populate cache
            await service.updateMany('testdb', 'testcollection', {}, { $set: { name: 'Updated Name' } });
            const cacheKey = `findOne:testdb:testcollection`;
            expect(service['cacheService'].get(cacheKey)).toBeUndefined();
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

        it('should invalidate cache after deleteOne', async () => {
            const doc = { name: 'John Doe' };
            await collection.insertOne(doc);
            await service.findOne('testdb', 'testcollection', { name: 'John Doe' }); // Populate cache
            await service.deleteOne('testdb', 'testcollection', { name: 'John Doe' });
            const cacheKey = `findOne:testdb:testcollection:${JSON.stringify({ name: 'John Doe' })}`;
            expect(service['cacheService'].get(cacheKey)).toBeUndefined();
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

        it('should invalidate cache after deleteMany', async () => {
            const docs = [{ name: 'John Doe' }, { name: 'Jane Doe' }];
            await collection.insertMany(docs);
            await service.findOne('testdb', 'testcollection', { name: 'John Doe' }); // Populate cache
            await service.deleteMany('testdb', 'testcollection', {});
            const cacheKey = `findOne:testdb:testcollection:`//${JSON.stringify({ name: 'John Doe' })}`;
            expect(service['cacheService'].get(cacheKey)).toBeUndefined();
        });
    });
});