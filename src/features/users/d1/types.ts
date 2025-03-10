
import { ObjectId } from "mongodb";
import { QueryResult, QueryResultsSinglePage } from 'cloudflare/resources/d1/database';
import { Result } from "cloudflare/resources";
import { D1 } from "cloudflare/resources/d1/d1";

export interface D1User {
    id: string;
    username: string;
    email: string;
}

export interface D1UserServiceType {
    getUsers(): Promise<D1User[] | undefined>;
    getUserById(id: string): Promise<D1User[] | undefined>;
    addUser(user: D1User): Promise<any[] | undefined>;
    deleteUser(id: string): Promise<any[]>;
}