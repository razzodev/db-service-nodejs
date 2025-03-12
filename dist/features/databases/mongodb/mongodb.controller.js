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
exports.MongoDatabaseController = void 0;
const mongodb_1 = require("mongodb");
class MongoDatabaseController {
    constructor(databaseService) {
        this.databaseService = databaseService;
        this.insertOne = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { database, collection, document } = req.body;
                const result = yield this.databaseService.insertOne(database, collection, document);
                res.json(result);
            }
            catch (error) {
                console.error('MongoDB insertOne error:', error);
                res.status(500).json({ error: error.message });
            }
        });
        this.insertMany = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { database, collection, documents } = req.body;
                const result = yield this.databaseService.insertMany(database, collection, documents);
                res.json(result);
            }
            catch (error) {
                console.error('MongoDB insertMany error:', error);
                res.status(500).json({ error: error.message });
            }
        });
        this.deleteOne = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { database, collection, id } = req.body;
                const result = yield this.databaseService.deleteOne(database, collection, { _id: new mongodb_1.ObjectId(id) });
                res.json(result);
            }
            catch (error) {
                console.error('MongoDB deleteOne error:', error);
                res.status(500).json({ error: error.message });
            }
        });
        this.updateOne = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { database, collection, id, updateDocument } = req.body;
                const result = yield this.databaseService.updateOne(database, collection, { _id: new mongodb_1.ObjectId(id) }, { $set: updateDocument });
                res.json(result);
            }
            catch (error) {
                console.error('MongoDB updateOne error:', error);
                res.status(500).json({ error: error.message });
            }
        });
        this.find = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { database, collection, query } = req.body;
                let result;
                if (query === 'all') {
                    result = yield this.databaseService.findAll(database, collection);
                }
                else if (query && query.id) {
                    result = yield this.databaseService.find(database, collection, { _id: new mongodb_1.ObjectId(query.id) });
                }
                else {
                    result = yield this.databaseService.find(database, collection, query);
                }
                res.json(result);
            }
            catch (error) {
                console.error('MongoDB find error:', error);
                res.status(500).json({ error: error.message });
            }
        });
        this.createDatabase = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { dbName } = req.body;
                const db = yield this.databaseService.createDatabase(dbName);
                res.status(201).json({ message: `Database ${dbName} created`, dbName: db.databaseName });
            }
            catch (error) {
                console.error('Error creating MongoDB database:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        this.deleteDatabase = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { dbName } = req.params;
                yield this.databaseService.deleteDatabase(dbName);
                res.status(204).send();
            }
            catch (error) {
                console.error('Error deleting MongoDB database:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        this.createCollection = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { dbName, collectionName } = req.body;
                const collection = yield this.databaseService.createCollection(dbName, collectionName);
                res.status(201).json({ message: `Collection ${collectionName} created`, collectionName: collection.collectionName });
            }
            catch (error) {
                console.error('Error creating MongoDB collection:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        this.deleteCollection = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { dbName, collectionName } = req.params;
                yield this.databaseService.deleteCollection(dbName, collectionName);
                res.status(204).send();
            }
            catch (error) {
                console.error('Error deleting MongoDB collection:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.MongoDatabaseController = MongoDatabaseController;
