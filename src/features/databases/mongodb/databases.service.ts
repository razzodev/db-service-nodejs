import { Db, MongoClient, CollectionInfo, Collection } from 'mongodb';

export class MongoDatabaseService {
    constructor(private client: MongoClient, private db: Db) { }

    async createDatabase(dbName: string): Promise<Db> {
        return this.client.db(dbName);
    }

    async deleteDatabase(dbName: string): Promise<void> {
        await this.client.db(dbName).dropDatabase();
    }

    async createCollection(collectionName: string): Promise<Collection<Document>> {
        return this.db.createCollection(collectionName);
    }

    async deleteCollection(collectionName: string): Promise<void> {
        await this.db.collection(collectionName).drop();
    }

    // Other MongoDB database management methods...
}