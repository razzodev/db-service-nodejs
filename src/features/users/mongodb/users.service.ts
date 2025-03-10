import { Db } from 'mongodb';
import { mongodb } from '../../../services/db'
import { MongoUserServiceType, IUser, ObjectId } from './types';
export default class MongoUsersService implements MongoUserServiceType {
    // private db: Db | undefined;
    private isConnected: boolean = false;

    constructor(private db: Db) {

    }

    private async connect(dbName: string): Promise<void> {
        await mongodb.connectToDatabase(dbName);
        this.db = mongodb.getDb();
        this.isConnected = true;
    }
    async getUsers() {
        try {
            if (!this.db) return undefined;
            const response = await this.db.collection<IUser>('users').find().toArray();
            if (!response) return undefined;
            return response || undefined;
        } catch (e) {
            throw new Error('Error getting users from D1:');
        }
    }
    async getUserById(id: string) {
        try {
            if (!this.db) return undefined;
            const response = await this.db.collection<IUser>('users').findOne({ _id: new ObjectId(id) });
            return response || undefined;
        } catch (e) {
            throw new Error('Error getting user by id from D1:');
        }
    }
    async addUser(user: IUser) {
        try {
            if (!this.db) return undefined;
            const response = await this.db.collection<IUser>('users').insertOne(user);
            if (!response?.insertedId) return undefined
            return response || undefined;
        } catch (e) {
            throw new Error('Error adding user to D1:');
        }
    }
    async deleteUser(id: string) {
        try {
            if (!this.db) return undefined;
            const response = await this.db.collection<IUser>('users').deleteOne({ _id: new ObjectId(id) });
            if (response.deletedCount === 0) {
                throw new Error('User not found');
            }
            return response as any || undefined;
        } catch (e) {
            throw new Error('Error deleting user from D1:');
        }
    }
}