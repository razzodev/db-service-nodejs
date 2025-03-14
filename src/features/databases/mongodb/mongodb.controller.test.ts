// test/features/databases/mongodb/databases.controller.test.ts
import { Request, Response } from 'express';
import { MongoDatabaseController } from './mongodb.controller';
import { MongoDatabaseService } from './mongodb.service';
import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('MongoDatabaseController', () => {
    let controller: MongoDatabaseController;
    let service: MongoDatabaseService;
    let client: MongoClient;
    let mongoServer: MongoMemoryServer;
    let db: Db;
    let collection: Collection;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let resSend: jest.Mock;
    let resJson: jest.Mock;
    let resStatus: jest.Mock;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        client = new MongoClient(uri);
        await client.connect();
        db = client.db('testdb');
        collection = db.collection('testcollection');
        service = new MongoDatabaseService(client);
        controller = new MongoDatabaseController(service);
    });

    afterAll(async () => {
        await client.close();
        await mongoServer.stop();
    });

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
        it('should find all documents', async () => {
            await collection.insertMany([{ name: 'Test1' }, { name: 'Test2' }]);
            req.body = { database: 'testdb', collection: 'testcollection', query: 'all' };
            await controller.find(req as Request, res as Response);
            expect(resStatus).toHaveBeenCalledWith(200);
            expect(resJson).toHaveBeenCalled();
        });
        it('should find one document by _id', async () => {
            const inserted = await collection.insertOne({ name: 'Test1' });
            req.body = { database: 'testdb', collection: 'testcollection', query: { _id: inserted.insertedId.toHexString() } };
            await controller.find(req as Request, res as Response);
            expect(resStatus).toHaveBeenCalledWith(200);
            expect(resJson).toHaveBeenCalled();
        });
        it('should find one document by name', async () => {
            await collection.insertOne({ name: 'Test1' });
            req.body = { database: 'testdb', collection: 'testcollection', query: { name: 'Test1' } };
            await controller.find(req as Request, res as Response);
            expect(resStatus).toHaveBeenCalledWith(200);
            expect(resJson).toHaveBeenCalled();
        });
    });

    describe('deleteOne', () => {
        it('should delete one document', async () => {
            const inserted = await collection.insertOne({ name: 'Test' });
            req.body = { database: 'testdb', collection: 'testcollection', id: inserted.insertedId.toHexString() };
            await controller.deleteOne(req as Request, res as Response);
            expect(resStatus).toHaveBeenCalledWith(200);
            expect(resJson).toHaveBeenCalled();
        });
    });

    describe('deleteMany', () => {
        it('should delete multiple documents', async () => {
            await collection.insertMany([{ name: 'Test1' }, { name: 'Test2' }]);
            req.body = { database: 'testdb', collection: 'testcollection', query: 'all' };
            await controller.deleteMany(req as Request, res as Response);
            expect(resStatus).toHaveBeenCalledWith(200);
            expect(resJson).toHaveBeenCalled();
        });
    });

    describe('insertOne', () => {
        it('should insert a document', async () => {
            req.body = { database: 'testdb', collection: 'testcollection', document: { name: 'Test' } };
            await controller.insertOne(req as Request, res as Response);
            expect(resStatus).toHaveBeenCalledWith(201);
            expect(resJson).toHaveBeenCalled();
        });
    });

    describe('insertMany', () => {
        it('should insert multiple documents', async () => {
            req.body = { database: 'testdb', collection: 'testcollection', documents: [{ name: 'Test1' }, { name: 'Test2' }] };
            await controller.insertMany(req as Request, res as Response);
            expect(resStatus).toHaveBeenCalledWith(201);
            expect(resJson).toHaveBeenCalled();
        });
    });

    describe('updateOne', () => {
        it('should update a document', async () => {
            const inserted = await collection.insertOne({ name: 'Test' });
            req.body = { database: 'testdb', collection: 'testcollection', _id: inserted.insertedId.toHexString(), update: { $set: { name: 'Updated' } } };
            await controller.updateOne(req as Request, res as Response);
            expect(resStatus).toHaveBeenCalledWith(200);
            expect(resJson).toHaveBeenCalled();
        });
    });

    describe('updateMany', () => {
        it('should update multiple documents', async () => {
            await collection.insertMany([{ name: 'Test1' }, { name: 'Test2' }]);
            req.body = { database: 'testdb', collection: 'testcollection', filter: {}, update: { $set: { name: 'Updated' } } };
            await controller.updateMany(req as Request, res as Response);
            expect(resStatus).toHaveBeenCalledWith(200);
            expect(resJson).toHaveBeenCalled();
        });
    });

    describe('createDatabase', () => {
        it('should create a database', async () => {
            req.body = { database: 'testdb' };
            await controller.createDatabase(req as Request, res as Response);
            expect(resStatus).toHaveBeenCalledWith(201);
            expect(resJson).toHaveBeenCalled();
        });
    });

    describe('deleteDatabase', () => {
        it('should delete a database', async () => {
            req.params = { database: 'testdb1' };
            await controller.createDatabase(req as Request, res as Response);
            await controller.deleteDatabase(req as Request, res as Response);
            expect(resStatus).toHaveBeenCalledWith(204);
            expect(resJson).toHaveBeenCalled();
        });
    });

    describe('createCollection', () => {
        it('should create a collection', async () => {
            req.body = { database: 'testdb', collection: 'testcollection1' };
            await controller.createCollection(req as Request, res as Response);
            expect(resStatus).toHaveBeenCalledWith(201);
            expect(resJson).toHaveBeenCalled();
        });
    });
    describe('deleteCollection', () => {
        it('should delete a collection', async () => {
            req.params = { database: 'testdb', collection: 'testcollection1' };
            await controller.deleteCollection(req as Request, res as Response);
            expect(resStatus).toHaveBeenCalledWith(204);
            expect(resJson).toHaveBeenCalled();
        });
    });
});