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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// test/features/databases/mongodb/databases.routes.test.ts
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const mongodb_routes_1 = require("./mongodb.routes");
const mongodb_controller_1 = require("./mongodb.controller");
const mongodb_service_1 = require("./mongodb.service");
const mongodb_1 = require("mongodb");
const mongodb_memory_server_1 = require("mongodb-memory-server");
describe('MongoDB Routes', () => {
    let app;
    let controller;
    let service;
    let client;
    let mongoServer;
    let db;
    let collection;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        client = new mongodb_1.MongoClient(uri);
        yield client.connect();
        db = client.db('testdb');
        collection = db.collection('testcollection');
        service = new mongodb_service_1.MongoDatabaseService(client);
        controller = new mongodb_controller_1.MongoDatabaseController(service);
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use((0, mongodb_routes_1.setupMongoDatabasesRoutes)(controller));
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield client.close();
        yield mongoServer.stop();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield collection.deleteMany({});
    }));
    describe('POST /insertOne', () => {
        it('should insert a document', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .post('/insertOne')
                .send({ database: 'testdb', collection: 'testcollection', document: { name: 'Test' } });
            expect(res.statusCode).toBe(201);
            expect(res.body.acknowledged).toBe(true);
        }));
    });
    describe('POST /insertMany', () => {
        it('should insert many documents', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .post('/insertMany')
                .send({ database: 'testdb', collection: 'testcollection', documents: [{ name: 'Test1' }, { name: 'Test2' }] });
            expect(res.statusCode).toBe(201);
            expect(res.body.insertedCount).toBe(2);
        }));
    });
    describe('POST /deleteOne', () => {
        it('should delete a document', () => __awaiter(void 0, void 0, void 0, function* () {
            const inserted = yield collection.insertOne({ name: 'Test' });
            const res = yield (0, supertest_1.default)(app)
                .post('/deleteOne')
                .send({ database: 'testdb', collection: 'testcollection', id: inserted.insertedId.toHexString() });
            expect(res.statusCode).toBe(200);
            expect(res.body.deletedCount).toBe(1);
        }));
    });
    describe('POST /updateOne', () => {
        it('should update a document', () => __awaiter(void 0, void 0, void 0, function* () {
            const inserted = yield collection.insertOne({ name: 'Test' });
            const res = yield (0, supertest_1.default)(app)
                .post('/updateOne')
                .send({ database: 'testdb', collection: 'testcollection', _id: inserted.insertedId.toHexString(), update: { $set: { name: 'Updated' } } });
            expect(res.statusCode).toBe(200);
            expect(res.body.modifiedCount).toBe(1);
        }));
    });
    describe('POST /updateMany', () => {
        it('should update many documents', () => __awaiter(void 0, void 0, void 0, function* () {
            yield collection.insertMany([{ name: 'Test1' }, { name: 'Test2' }]);
            const res = yield (0, supertest_1.default)(app)
                .post('/updateMany')
                .send({ database: 'testdb', collection: 'testcollection', filter: {}, update: { $set: { name: 'Updated' } } });
            expect(res.statusCode).toBe(200);
            expect(res.body.modifiedCount).toBe(2);
        }));
    });
    describe('POST /find', () => {
        it('should find documents', () => __awaiter(void 0, void 0, void 0, function* () {
            yield collection.insertOne({ name: 'Test' });
            const res = yield (0, supertest_1.default)(app)
                .post('/find')
                .send({ database: 'testdb', collection: 'testcollection', query: { name: 'Test' } });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(1);
        }));
        it('should find one document by _id', () => __awaiter(void 0, void 0, void 0, function* () {
            const inserted = yield collection.insertOne({ name: 'Test' });
            const res = yield (0, supertest_1.default)(app)
                .post('/find')
                .send({ database: 'testdb', collection: 'testcollection', query: { _id: inserted.insertedId.toHexString() } });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('name', 'Test');
        }));
        it('should find all documents', () => __awaiter(void 0, void 0, void 0, function* () {
            yield collection.insertMany([{ name: 'Test1' }, { name: 'Test2' }]);
            const res = yield (0, supertest_1.default)(app)
                .post('/find')
                .send({ database: 'testdb', collection: 'testcollection', query: 'all' });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(2);
        }));
    });
    describe('POST /createDatabase', () => {
        it('should create a database', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .post('/createDatabase')
                .send({ database: 'newdb' });
            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe('Database newdb created');
        }));
    });
    describe('DELETE /deleteDatabase/:database', () => {
        it('should delete a database', () => __awaiter(void 0, void 0, void 0, function* () {
            yield service.createDatabase('todelete');
            const res = yield (0, supertest_1.default)(app)
                .delete('/deleteDatabase/todelete');
            expect(res.statusCode).toBe(204);
        }));
    });
    describe('POST /createCollection', () => {
        it('should create a collection', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .post('/createCollection')
                .send({ database: 'testdb', collection: 'newcollection' });
            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe('Collection newcollection created');
        }));
    });
    describe('DELETE /deleteCollection/:database/:collection', () => {
        it('should delete a collection', () => __awaiter(void 0, void 0, void 0, function* () {
            yield service.createCollection('testdb', 'todelete');
            const res = yield (0, supertest_1.default)(app)
                .delete('/deleteCollection/testdb/todelete');
            expect(res.statusCode).toBe(204);
        }));
    });
});
