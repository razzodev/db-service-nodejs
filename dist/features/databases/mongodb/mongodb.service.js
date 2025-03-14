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
const cache_1 = require("../../../services/cache");
class MongoDatabaseService {
    constructor(client) {
        this.client = client;
        this.createDatabase = (dbName) => __awaiter(this, void 0, void 0, function* () {
            return this.getDatabase(dbName);
        });
        this.deleteDatabase = (dbName) => __awaiter(this, void 0, void 0, function* () {
            const keysToDelete = this.cacheService.getKeys().filter(key => key.startsWith(`${dbName}:`));
            this.cacheService.del(keysToDelete);
            return yield this.getDatabase(dbName).dropDatabase();
        });
        this.createCollection = (dbName, collectionName) => __awaiter(this, void 0, void 0, function* () {
            return this.getDatabase(dbName).createCollection(collectionName);
        });
        this.deleteCollection = (dbName, collectionName) => __awaiter(this, void 0, void 0, function* () {
            const keysToDelete = this.cacheService.getKeys().filter(key => key.includes(`${dbName}:${collectionName}`));
            this.cacheService.del(keysToDelete);
            return yield this.getDatabase(dbName).collection(collectionName).drop();
        });
        this.find = (dbName, collection, query) => __awaiter(this, void 0, void 0, function* () {
            const cacheKey = `find:${dbName}:${collection}:${JSON.stringify(query)}`;
            return (0, cache_1.getCachedOrExecute)(this.cacheService, cacheKey, () => this.getDatabase(dbName).collection(collection).find(query).toArray());
        });
        this.findAll = (dbName, collection) => __awaiter(this, void 0, void 0, function* () {
            const cacheKey = `findAll:${dbName}:${collection}`;
            return (0, cache_1.getCachedOrExecute)(this.cacheService, cacheKey, () => this.getDatabase(dbName).collection(collection).find({}).toArray());
        });
        this.findOne = (dbName, collection, query) => __awaiter(this, void 0, void 0, function* () {
            const cacheKey = `findOne:${dbName}:${collection}:${JSON.stringify(query)}`;
            return (0, cache_1.getCachedOrExecute)(this.cacheService, cacheKey, () => this.getDatabase(dbName).collection(collection).findOne(query));
        });
        this.insertOne = (dbName, collection, document) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.getDatabase(dbName).collection(collection).insertOne(document);
            this.invalidateCache(dbName, collection);
            return result;
        });
        this.insertMany = (dbName, collection, documents) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.getDatabase(dbName).collection(collection).insertMany(documents);
            this.invalidateCache(dbName, collection);
            return result;
        });
        this.updateOne = (dbName, collection, filter, update) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.getDatabase(dbName).collection(collection).updateOne(filter, update);
            this.invalidateCacheForUpdate(dbName, collection, filter);
            return result;
        });
        this.updateMany = (dbName_1, collection_1, filter_1, update_1, ...args_1) => __awaiter(this, [dbName_1, collection_1, filter_1, update_1, ...args_1], void 0, function* (dbName, collection, filter, update, options = {}) {
            const result = yield this.getDatabase(dbName).collection(collection).updateMany(filter, update, options);
            this.invalidateCacheForUpdate(dbName, collection, filter);
            return result;
        });
        this.deleteOne = (dbName, collection, filter) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.getDatabase(dbName).collection(collection).deleteOne(filter);
            this.invalidateCacheForDelete(dbName, collection, filter);
            return result;
        });
        this.deleteMany = (dbName, collection, filter) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.getDatabase(dbName).collection(collection).deleteMany(filter);
            this.invalidateCacheForDelete(dbName, collection, filter);
            return result;
        });
        this.invalidateCache = (dbName, collection) => {
            const keysToDelete = this.cacheService.getKeys().filter(key => key.includes(`${dbName}:${collection}`));
            this.cacheService.del(keysToDelete);
        };
        this.invalidateCacheForUpdate = (dbName, collection, filter) => {
            const keysToDelete = [
                `findOne:${dbName}:${collection}:${JSON.stringify(filter)}`,
                `find:${dbName}:${collection}:${JSON.stringify(filter)}`,
                `findAll:${dbName}:${collection}`
            ];
            this.cacheService.del(keysToDelete);
        };
        this.invalidateCacheForDelete = (dbName, collection, filter) => {
            const keysToDelete = [
                `findOne:${dbName}:${collection}:${JSON.stringify(filter)}`,
                `find:${dbName}:${collection}:${JSON.stringify(filter)}`,
                `findAll:${dbName}:${collection}`
            ];
            this.cacheService.del(keysToDelete);
        };
        this.cacheService = new cache_1.InMemoryCacheService();
    }
    getDatabase(dbName) {
        return this.client.db(dbName);
    }
}
exports.MongoDatabaseService = MongoDatabaseService;
