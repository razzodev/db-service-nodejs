import { Db, MongoClient, Collection, InsertOneResult, InsertManyResult, DeleteResult, UpdateResult } from 'mongodb';
import { InMemoryCacheService, getCachedOrExecute } from '../../../services/cache';

export class MongoDatabaseService {
    private cacheService: InMemoryCacheService;

    constructor(private client: MongoClient) {
        this.cacheService = new InMemoryCacheService();
    }

    private getDatabase(dbName: string): Db {
        return this.client.db(dbName);
    }

    createDatabase = async (dbName: string): Promise<Db> => {
        return this.getDatabase(dbName);
    }

    deleteDatabase = async (dbName: string): Promise<void> => {
        const keysToDelete = this.cacheService.getKeys().filter(key => key.startsWith(`${dbName}:`));
        this.cacheService.del(keysToDelete);
        await this.getDatabase(dbName).dropDatabase();
    }

    createCollection = async (dbName: string, collectionName: string): Promise<Collection<Document>> => {
        return this.getDatabase(dbName).createCollection(collectionName);
    }

    deleteCollection = async (dbName: string, collectionName: string): Promise<void> => {
        const keysToDelete = this.cacheService.getKeys().filter(key => key.includes(`${dbName}:${collectionName}`));
        this.cacheService.del(keysToDelete);
        await this.getDatabase(dbName).collection(collectionName).drop();
    }

    find = async (dbName: string, collection: string, query: any): Promise<any[]> => {
        const cacheKey = `find:${dbName}:${collection}:${JSON.stringify(query)}`;
        return getCachedOrExecute(this.cacheService, cacheKey, () =>
            this.getDatabase(dbName).collection(collection).find(query).toArray()
        );
    }

    findAll = async (dbName: string, collection: string): Promise<any[]> => {
        const cacheKey = `findAll:${dbName}:${collection}`;
        return getCachedOrExecute(this.cacheService, cacheKey, () =>
            this.getDatabase(dbName).collection(collection).find({}).toArray()
        );
    }

    findOne = async (dbName: string, collection: string, query: any): Promise<any> => {
        const cacheKey = `findOne:${dbName}:${collection}:${JSON.stringify(query)}`;
        return getCachedOrExecute(this.cacheService, cacheKey, () =>
            this.getDatabase(dbName).collection(collection).findOne(query)
        );
    }

    insertOne = async (dbName: string, collection: string, document: any): Promise<InsertOneResult> => {
        const result = await this.getDatabase(dbName).collection(collection).insertOne(document);
        this.invalidateCache(dbName, collection);
        return result;
    }

    insertMany = async (dbName: string, collection: string, documents: any[]): Promise<InsertManyResult> => {
        const result = await this.getDatabase(dbName).collection(collection).insertMany(documents);
        this.invalidateCache(dbName, collection);
        return result;
    }

    updateOne = async (dbName: string, collection: string, filter: any, update: any): Promise<UpdateResult> => {
        const result = await this.getDatabase(dbName).collection(collection).updateOne(filter, update);
        this.invalidateCacheForUpdate(dbName, collection, filter);
        return result;
    }

    updateMany = async (dbName: string, collection: string, filter: any, update: any): Promise<UpdateResult> => {
        const result = await this.getDatabase(dbName).collection(collection).updateMany(filter, update);
        this.invalidateCacheForUpdate(dbName, collection, filter);
        return result;
    }

    deleteOne = async (dbName: string, collection: string, filter: any): Promise<DeleteResult> => {
        const result = await this.getDatabase(dbName).collection(collection).deleteOne(filter);
        this.invalidateCacheForDelete(dbName, collection, filter);
        return result;
    }

    deleteMany = async (dbName: string, collection: string, filter: any): Promise<DeleteResult> => {
        const result = await this.getDatabase(dbName).collection(collection).deleteMany(filter);
        this.invalidateCacheForDelete(dbName, collection, filter);
        return result;
    }

    private invalidateCache = (dbName: string, collection: string): void => {
        const keysToDelete = this.cacheService.getKeys().filter(key => key.includes(`${dbName}:${collection}`));
        this.cacheService.del(keysToDelete);
    }

    private invalidateCacheForUpdate = (dbName: string, collection: string, filter: any): void => {
        const keysToDelete = [
            `findOne:${dbName}:${collection}:${JSON.stringify(filter)}`,
            `find:${dbName}:${collection}:${JSON.stringify(filter)}`,
            `findAll:${dbName}:${collection}`
        ];
        this.cacheService.del(keysToDelete);
    }

    private invalidateCacheForDelete = (dbName: string, collection: string, filter: any): void => {
        const keysToDelete = [
            `findOne:${dbName}:${collection}:${JSON.stringify(filter)}`,
            `find:${dbName}:${collection}:${JSON.stringify(filter)}`,
            `findAll:${dbName}:${collection}`
        ];
        this.cacheService.del(keysToDelete);
    }
}