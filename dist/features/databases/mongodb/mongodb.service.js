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
exports.MongoDatabaseService = void 0;
class MongoDatabaseService {
    constructor(client) {
        this.client = client;
        this.createDatabase = (dbName) => __awaiter(this, void 0, void 0, function* () {
            return this.getDatabase(dbName);
        });
        this.deleteDatabase = (dbName) => __awaiter(this, void 0, void 0, function* () {
            yield this.getDatabase(dbName).dropDatabase();
        });
        this.createCollection = (dbName, collectionName) => __awaiter(this, void 0, void 0, function* () {
            return this.getDatabase(dbName).createCollection(collectionName);
        });
        this.deleteCollection = (dbName, collectionName) => __awaiter(this, void 0, void 0, function* () {
            yield this.getDatabase(dbName).collection(collectionName).drop();
        });
        this.find = (dbName, collection, query) => __awaiter(this, void 0, void 0, function* () {
            return this.getDatabase(dbName).collection(collection).find(query).toArray();
        });
        this.findAll = (dbName, collection) => __awaiter(this, void 0, void 0, function* () {
            return this.getDatabase(dbName).collection(collection).find({}).toArray();
        });
        this.findOne = (dbName, collection, query) => __awaiter(this, void 0, void 0, function* () {
            return this.getDatabase(dbName).collection(collection).findOne(query);
        });
        this.insertOne = (dbName, collection, document) => __awaiter(this, void 0, void 0, function* () {
            return this.getDatabase(dbName).collection(collection).insertOne(document);
        });
        this.insertMany = (dbName, collection, documents) => __awaiter(this, void 0, void 0, function* () {
            return this.getDatabase(dbName).collection(collection).insertMany(documents);
        });
        this.updateOne = (dbName, collection, filter, update) => __awaiter(this, void 0, void 0, function* () {
            return this.getDatabase(dbName).collection(collection).updateOne(filter, update);
        });
        this.deleteOne = (dbName, collection, filter) => __awaiter(this, void 0, void 0, function* () {
            return this.getDatabase(dbName).collection(collection).deleteOne(filter);
        });
    } // Removed db from constructor
    getDatabase(dbName) {
        return this.client.db(dbName);
    }
}
exports.MongoDatabaseService = MongoDatabaseService;
