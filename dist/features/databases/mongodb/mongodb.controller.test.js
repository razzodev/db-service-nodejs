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
const mongodb_controller_1 = require("./mongodb.controller");
const mongodb_service_1 = require("./mongodb.service");
const mongodb_1 = require("mongodb");
const mongodb_memory_server_1 = require("mongodb-memory-server");
describe('MongoDatabaseController', () => {
    let controller;
    let service;
    let client;
    let mongoServer;
    let db;
    let collection;
    let req;
    let res;
    let resSend;
    let resJson;
    let resStatus;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        client = new mongodb_1.MongoClient(uri);
        yield client.connect();
        db = client.db('testdb');
        collection = db.collection('testcollection');
        service = new mongodb_service_1.MongoDatabaseService(client);
        controller = new mongodb_controller_1.MongoDatabaseController(service);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield client.close();
        yield mongoServer.stop();
    }));
    beforeEach(() => {
        req = {};
        resJson = jest.fn();
        resStatus = jest.fn().mockReturnValue({ json: resJson, send: resSend });
        resSend = jest.fn();
        res = {
            status: resStatus,
            json: resJson,
            send: resSend,
        };
        collection.deleteMany({});
    });
    describe('find', () => {
        it('should find all documents', () => __awaiter(void 0, void 0, void 0, function* () {
            yield collection.insertMany([{ name: 'Test1' }, { name: 'Test2' }]);
            req.body = { database: 'testdb', collection: 'testcollection', query: 'all' };
            yield controller.find(req, res);
            expect(resStatus).toHaveBeenCalledWith(200);
            expect(resJson).toHaveBeenCalled();
        }));
        it('should find one document by _id', () => __awaiter(void 0, void 0, void 0, function* () {
            const inserted = yield collection.insertOne({ name: 'Test1' });
            req.body = { database: 'testdb', collection: 'testcollection', query: { _id: inserted.insertedId.toHexString() } };
            yield controller.find(req, res);
            expect(resStatus).toHaveBeenCalledWith(200);
            expect(resJson).toHaveBeenCalled();
        }));
        it('should find one document by name', () => __awaiter(void 0, void 0, void 0, function* () {
            yield collection.insertOne({ name: 'Test1' });
            req.body = { database: 'testdb', collection: 'testcollection', query: { name: 'Test1' } };
            yield controller.find(req, res);
            expect(resStatus).toHaveBeenCalledWith(200);
            expect(resJson).toHaveBeenCalled();
        }));
    });
    describe('deleteOne', () => {
        it('should delete one document', () => __awaiter(void 0, void 0, void 0, function* () {
            const inserted = yield collection.insertOne({ name: 'Test' });
            req.body = { database: 'testdb', collection: 'testcollection', id: inserted.insertedId.toHexString() };
            yield controller.deleteOne(req, res);
            expect(resStatus).toHaveBeenCalledWith(200);
            expect(resJson).toHaveBeenCalled();
        }));
    });
    describe('deleteMany', () => {
        it('should delete multiple documents', () => __awaiter(void 0, void 0, void 0, function* () {
            yield collection.insertMany([{ name: 'Test1' }, { name: 'Test2' }]);
            req.body = { database: 'testdb', collection: 'testcollection', query: 'all' };
            yield controller.deleteMany(req, res);
            expect(resStatus).toHaveBeenCalledWith(200);
            expect(resJson).toHaveBeenCalled();
        }));
    });
    describe('insertOne', () => {
        it('should insert a document', () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = { database: 'testdb', collection: 'testcollection', document: { name: 'Test' } };
            yield controller.insertOne(req, res);
            expect(resStatus).toHaveBeenCalledWith(201);
            expect(resJson).toHaveBeenCalled();
        }));
    });
    describe('insertMany', () => {
        it('should insert multiple documents', () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = { database: 'testdb', collection: 'testcollection', documents: [{ name: 'Test1' }, { name: 'Test2' }] };
            yield controller.insertMany(req, res);
            expect(resStatus).toHaveBeenCalledWith(201);
            expect(resJson).toHaveBeenCalled();
        }));
    });
    describe('updateOne', () => {
        it('should update a document', () => __awaiter(void 0, void 0, void 0, function* () {
            const inserted = yield collection.insertOne({ name: 'Test' });
            req.body = { database: 'testdb', collection: 'testcollection', _id: inserted.insertedId.toHexString(), update: { $set: { name: 'Updated' } } };
            yield controller.updateOne(req, res);
            expect(resStatus).toHaveBeenCalledWith(200);
            expect(resJson).toHaveBeenCalled();
        }));
    });
    describe('updateMany', () => {
        it('should update multiple documents', () => __awaiter(void 0, void 0, void 0, function* () {
            yield collection.insertMany([{ name: 'Test1' }, { name: 'Test2' }]);
            req.body = { database: 'testdb', collection: 'testcollection', filter: {}, update: { $set: { name: 'Updated' } } };
            yield controller.updateMany(req, res);
            expect(resStatus).toHaveBeenCalledWith(200);
            expect(resJson).toHaveBeenCalled();
        }));
    });
    describe('createDatabase', () => {
        it('should create a database', () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = { database: 'testdb' };
            yield controller.createDatabase(req, res);
            expect(resStatus).toHaveBeenCalledWith(201);
            expect(resJson).toHaveBeenCalled();
        }));
    });
    describe('deleteDatabase', () => {
        it('should delete a database', () => __awaiter(void 0, void 0, void 0, function* () {
            req.params = { database: 'testdb1' };
            yield controller.createDatabase(req, res);
            yield controller.deleteDatabase(req, res);
            expect(resStatus).toHaveBeenCalledWith(204);
            expect(resJson).toHaveBeenCalled();
        }));
    });
    describe('createCollection', () => {
        it('should create a collection', () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = { database: 'testdb', collection: 'testcollection1' };
            yield controller.createCollection(req, res);
            expect(resStatus).toHaveBeenCalledWith(201);
            expect(resJson).toHaveBeenCalled();
        }));
    });
    describe('deleteCollection', () => {
        it('should delete a collection', () => __awaiter(void 0, void 0, void 0, function* () {
            req.params = { database: 'testdb', collection: 'testcollection1' };
            yield controller.deleteCollection(req, res);
            expect(resStatus).toHaveBeenCalledWith(204);
            expect(resJson).toHaveBeenCalled();
        }));
    });
});
