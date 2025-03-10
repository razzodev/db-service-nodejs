import { ObjectId, WithId, InsertOneResult, DeleteResult } from "mongodb";
export { ObjectId }
export interface IUser {
    _id: ObjectId;
    username: string;
    email: string;
}
export interface MongoUserServiceType {
    getUsers(): Promise<IUser[] | undefined>;
    getUserById(id: string): Promise<WithId<IUser> | undefined>;
    addUser(user: IUser): Promise<InsertOneResult<IUser> | undefined>;
    deleteUser(id: string): Promise<DeleteResult | undefined>;
}