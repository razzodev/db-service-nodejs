import { Db, MongoClient, Collection, InsertOneResult, InsertManyResult, DeleteResult, UpdateResult } from 'mongodb';
import { InMemoryCacheService } from '../../../services/cache';

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
        await this.getDatabase(dbName).dropDatabase();
    }

    createCollection = async (dbName: string, collectionName: string): Promise<Collection<Document>> => {
        return this.getDatabase(dbName).createCollection(collectionName);
    }

    deleteCollection = async (dbName: string, collectionName: string): Promise<void> => {
        await this.getDatabase(dbName).collection(collectionName).drop();
    }

    find = async (dbName: string, collection: string, query: any): Promise<any[]> => {
        return this.getDatabase(dbName).collection(collection).find(query).toArray();
    }

    findAll = async (dbName: string, collection: string): Promise<any[]> => {
        return this.getDatabase(dbName).collection(collection).find({}).toArray();
    }

    findOne = async (dbName: string, collection: string, query: any): Promise<any> => {
        return this.getDatabase(dbName).collection(collection).findOne(query);
    }

    insertOne = async (dbName: string, collection: string, document: any): Promise<InsertOneResult> => {
        return this.getDatabase(dbName).collection(collection).insertOne(document);
    }

    insertMany = async (dbName: string, collection: string, documents: any[]): Promise<InsertManyResult> => {
        return this.getDatabase(dbName).collection(collection).insertMany(documents);
    }

    updateOne = async (dbName: string, collection: string, filter: any, update: any): Promise<UpdateResult> => {
        return this.getDatabase(dbName).collection(collection).updateOne(filter, update);
    }

    deleteOne = async (dbName: string, collection: string, filter: any): Promise<DeleteResult> => {
        return this.getDatabase(dbName).collection(collection).deleteOne(filter);
    }
}