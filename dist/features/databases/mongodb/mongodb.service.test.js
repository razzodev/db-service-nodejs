"use strict";
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
const mongodb_1 = require("mongodb");
const mongodb_service_1 = require("./mongodb.service");
const mongodb_memory_server_1 = require("mongodb-memory-server"); // Import
describe('MongoDatabaseService', () => {
    let db;
    let collection;
    let service;
    let client;
    let mongoServer; // Declare server
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create(); // Start server
        const uri = mongoServer.getUri(); // Get URI
        client = new mongodb_1.MongoClient(uri);
        yield client.connect();
        db = client.db('testdb');
        collection = db.collection('testcollection');
        service = new mongodb_service_1.MongoDatabaseService(client);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield client.close();
        yield mongoServer.stop(); // Stop server
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield collection.deleteMany({});
    }));
    describe('createDatabase', () => {
        it('should create a database', () => __awaiter(void 0, void 0, void 0, function* () {
            const dbName = 'newdb';
            const createdDb = yield service.createDatabase(dbName);
            expect(createdDb.databaseName).toBe(dbName);
        }));
    });
    describe('deleteDatabase', () => {
        it('should delete a database', () => __awaiter(void 0, void 0, void 0, function* () {
            const dbName = 'todelete';
            yield service.createDatabase(dbName);
            yield service.deleteDatabase(dbName);
            const databases = yield db.listCollections().toArray();
            expect(databases.map(col => col.name)).not.toContain(dbName);
        }));
        it('should invalidate cache after deleteDatabase', () => __awaiter(void 0, void 0, void 0, function* () {
            const dbName = 'todelete';
            yield service.createDatabase(dbName);
            yield service.findOne(dbName, 'testcollection', { name: 'John Doe' }); // Populate cache
            yield service.deleteDatabase(dbName);
            expect(service['cacheService'].getKeys().filter(key => key.startsWith(`${dbName}:`)).length).toBe(0);
        }));
    });
    describe('createCollection', () => {
        it('should create a collection', () => __awaiter(void 0, void 0, void 0, function* () {
            const collectionName = 'newcollection';
            const createdCollection = yield service.createCollection('testdb', collectionName);
            expect(createdCollection.collectionName).toBe(collectionName);
        }));
    });
    describe('deleteCollection', () => {
        it('should delete a collection', () => __awaiter(void 0, void 0, void 0, function* () {
            const collectionName = 'todelete';
            yield service.createCollection('testdb', collectionName);
            yield service.deleteCollection('testdb', collectionName);
            const collections = yield db.listCollections().toArray();
            expect(collections.map(col => col.name)).not.toContain(collectionName);
        }));
        it('should invalidate cache after deleteCollection', () => __awaiter(void 0, void 0, void 0, function* () {
            const collectionName = 'todelete';
            yield service.createCollection('testdb', collectionName);
            yield service.findOne('testdb', collectionName, { name: 'John Doe' }); // Populate cache
            yield service.deleteCollection('testdb', collectionName);
            expect(service['cacheService'].getKeys().filter(key => key.includes(`testdb:${collectionName}`)).length).toBe(0);
        }));
    });
    describe('find', () => {
        it('should find documents in a collection', () => __awaiter(void 0, void 0, void 0, function* () {
            const doc = { name: 'John Doe' };
            yield collection.insertOne(doc);
            const result = yield service.find('testdb', 'testcollection', { name: 'John Doe' });
            expect(result).toContainEqual(doc);
        }));
        it('should return cached result on second call', () => __awaiter(void 0, void 0, void 0, function* () {
            const cacheKey = `find:testdb:testcollection:${JSON.stringify({ name: 'John Doe' })}`;
            yield service.find('testdb', 'testcollection', { name: 'John Doe' });
            const cachedResult = service['cacheService'].get(cacheKey);
            expect(cachedResult).toBeDefined();
            const result = yield service.find('testdb', 'testcollection', { name: 'John Doe' });
            expect(result).toEqual(cachedResult);
        }));
    });
    describe('findAll', () => {
        it('should find all documents in a collection', () => __awaiter(void 0, void 0, void 0, function* () {
            const docs = [{ name: 'John Doe' }, { name: 'Jane Doe' }];
            yield collection.insertMany(docs);
            const result = yield service.findAll('testdb', 'testcollection');
            expect(result).toEqual(docs);
        }));
        it('should return cached result on second call', () => __awaiter(void 0, void 0, void 0, function* () {
            const cacheKey = `findAll:testdb:testcollection`;
            yield service.findAll('testdb', 'testcollection');
            const cachedResult = service['cacheService'].get(cacheKey);
            expect(cachedResult).toBeDefined();
            const result = yield service.findAll('testdb', 'testcollection');
            expect(result).toEqual(cachedResult);
        }));
    });
    describe('findOne', () => {
        it('should find one document in a collection', () => __awaiter(void 0, void 0, void 0, function* () {
            const doc = { name: 'John Doe' };
            yield collection.insertOne(doc);
            const result = yield service.findOne('testdb', 'testcollection', { name: 'John Doe' });
            expect(result).toEqual(doc);
        }));
        it('should return cached result on second call', () => __awaiter(void 0, void 0, void 0, function* () {
            const cacheKey = `findOne:testdb:testcollection:${JSON.stringify({ name: 'John Doe' })}`;
            yield service.findOne('testdb', 'testcollection', { name: 'John Doe' });
            const cachedResult = service['cacheService'].get(cacheKey);
            expect(cachedResult).toBeDefined();
            const result = yield service.findOne('testdb', 'testcollection', { name: 'John Doe' });
            expect(result).toEqual(cachedResult);
        }));
    });
    describe('insertOne', () => {
        it('should insert one document into a collection', () => __awaiter(void 0, void 0, void 0, function* () {
            const doc = { name: 'John Doe' };
            const result = yield service.insertOne('testdb', 'testcollection', doc);
            expect(result.acknowledged).toBe(true);
            const insertedDoc = yield collection.findOne({ _id: result.insertedId });
            expect(insertedDoc).toEqual(doc);
        }));
        it('should invalidate cache after insertOne', () => __awaiter(void 0, void 0, void 0, function* () {
            const doc = { name: 'John Doe' };
            yield service.findOne('testdb', 'testcollection', { name: 'John Doe' }); // Populate cache
            yield service.insertOne('testdb', 'testcollection', doc);
            const cacheKey = `findOne:testdb:testcollection:${JSON.stringify({ name: 'John Doe' })}`;
            expect(service['cacheService'].get(cacheKey)).toBeUndefined();
        }));
    });
    describe('insertMany', () => {
        it('should insert many documents into a collection', () => __awaiter(void 0, void 0, void 0, function* () {
            const docs = [{ name: 'John Doe' }, { name: 'Jane Doe' }];
            const result = yield service.insertMany('testdb', 'testcollection', docs);
            expect(result.insertedCount).toBe(2);
            const insertedDocs = yield collection.find({}).toArray();
            expect(insertedDocs).toEqual(docs);
        }));
        it('should invalidate cache after insertMany', () => __awaiter(void 0, void 0, void 0, function* () {
            const docs = [{ name: 'John Doe' }, { name: 'Jane Doe' }];
            yield service.findOne('testdb', 'testcollection', { name: 'John Doe' }); // Populate cache
            yield service.insertMany('testdb', 'testcollection', docs);
            const cacheKey = `findOne:testdb:testcollection:${JSON.stringify({ name: 'John Doe' })}`;
            expect(service['cacheService'].get(cacheKey)).toBeUndefined();
        }));
    });
    describe('updateOne', () => {
        it('should update one document in a collection', () => __awaiter(void 0, void 0, void 0, function* () {
            const doc = { name: 'John Doe' };
            yield collection.insertOne(doc);
            const result = yield service.updateOne('testdb', 'testcollection', { name: 'John Doe' }, { $set: { name: 'Jane Doe' } });
            expect(result.modifiedCount).toBe(1);
            const updatedDoc = yield collection.findOne({ name: 'Jane Doe' });
            expect(updatedDoc).toEqual(Object.assign(Object.assign({}, doc), { name: 'Jane Doe' }));
        }));
        it('should invalidate cache after updateOne', () => __awaiter(void 0, void 0, void 0, function* () {
            const doc = { name: 'John Doe' };
            yield collection.insertOne(doc);
            yield service.findOne('testdb', 'testcollection', { name: 'John Doe' }); // Populate cache
            yield service.updateOne('testdb', 'testcollection', { name: 'John Doe' }, { $set: { name: 'Jane Doe' } });
            const cacheKey = `findOne:testdb:testcollection:${JSON.stringify({ name: 'John Doe' })}`;
            expect(service['cacheService'].get(cacheKey)).toBeUndefined();
        }));
    });
    describe('updateMany', () => {
        it('should update many documents in a collection', () => __awaiter(void 0, void 0, void 0, function* () {
            const docs = [{ name: 'John Doe' }, { name: 'Jane Doe' }];
            yield collection.insertMany(docs);
            const result = yield service.updateMany('testdb', 'testcollection', {}, { $set: { name: 'Updated Name' } });
            expect(result.modifiedCount).toBe(2);
            const updatedDocs = yield collection.find({}).toArray();
            expect(updatedDocs).toEqual([{ _id: expect.any(Object), name: 'Updated Name' }, { _id: expect.any(Object), name: 'Updated Name' }]);
        }));
        it('should invalidate cache after updateMany', () => __awaiter(void 0, void 0, void 0, function* () {
            const docs = [{ name: 'John Doe' }, { name: 'Jane Doe' }];
            yield collection.insertMany(docs);
            yield service.findOne('testdb', 'testcollection', { name: 'John Doe' }); // Populate cache
            yield service.updateMany('testdb', 'testcollection', {}, { $set: { name: 'Updated Name' } });
            const cacheKey = `findOne:testdb:testcollection`;
            expect(service['cacheService'].get(cacheKey)).toBeUndefined();
        }));
    });
    describe('deleteOne', () => {
        it('should delete one document from a collection', () => __awaiter(void 0, void 0, void 0, function* () {
            const doc = { name: 'John Doe' };
            yield collection.insertOne(doc);
            const result = yield service.deleteOne('testdb', 'testcollection', { name: 'John Doe' });
            expect(result.deletedCount).toBe(1);
            const remainingDocs = yield collection.find({}).toArray();
            expect(remainingDocs.length).toBe(0);
        }));
        it('should invalidate cache after deleteOne', () => __awaiter(void 0, void 0, void 0, function* () {
            const doc = { name: 'John Doe' };
            yield collection.insertOne(doc);
            yield service.findOne('testdb', 'testcollection', { name: 'John Doe' }); // Populate cache
            yield service.deleteOne('testdb', 'testcollection', { name: 'John Doe' });
            const cacheKey = `findOne:testdb:testcollection:${JSON.stringify({ name: 'John Doe' })}`;
            expect(service['cacheService'].get(cacheKey)).toBeUndefined();
        }));
    });
    describe('deleteMany', () => {
        it('should delete many documents from a collection', () => __awaiter(void 0, void 0, void 0, function* () {
            const docs = [{ name: 'John Doe' }, { name: 'Jane Doe' }];
            yield collection.insertMany(docs);
            const result = yield service.deleteMany('testdb', 'testcollection', {});
            expect(result.deletedCount).toBe(2);
            const remainingDocs = yield collection.find({}).toArray();
            expect(remainingDocs.length).toBe(0);
        }));
        it('should invalidate cache after deleteMany', () => __awaiter(void 0, void 0, void 0, function* () {
            const docs = [{ name: 'John Doe' }, { name: 'Jane Doe' }];
            yield collection.insertMany(docs);
            yield service.findOne('testdb', 'testcollection', { name: 'John Doe' }); // Populate cache
            yield service.deleteMany('testdb', 'testcollection', {});
            const cacheKey = `findOne:testdb:testcollection:`; //${JSON.stringify({ name: 'John Doe' })}`;
            expect(service['cacheService'].get(cacheKey)).toBeUndefined();
        }));
    });
});
