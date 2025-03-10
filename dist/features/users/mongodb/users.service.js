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
const db_1 = require("../../db/");
const types_1 = require("./types");
class MongoUsersService {
    constructor(db) {
        this.db = db;
        // private db: Db | undefined;
        this.isConnected = false;
    }
    connect(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.mongodb.connectToDatabase(dbName);
            this.db = db_1.mongodb.getDb();
            this.isConnected = true;
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.db)
                    return undefined;
                const response = yield this.db.collection('users').find().toArray();
                if (!response)
                    return undefined;
                return response || undefined;
            }
            catch (e) {
                throw new Error('Error getting users from D1:');
            }
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.db)
                    return undefined;
                const response = yield this.db.collection('users').findOne({ _id: new types_1.ObjectId(id) });
                return response || undefined;
            }
            catch (e) {
                throw new Error('Error getting user by id from D1:');
            }
        });
    }
    addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.db)
                    return undefined;
                const response = yield this.db.collection('users').insertOne(user);
                if (!(response === null || response === void 0 ? void 0 : response.insertedId))
                    return undefined;
                return response || undefined;
            }
            catch (e) {
                throw new Error('Error adding user to D1:');
            }
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.db)
                    return undefined;
                const response = yield this.db.collection('users').deleteOne({ _id: new types_1.ObjectId(id) });
                if (response.deletedCount === 0) {
                    throw new Error('User not found');
                }
                return response || undefined;
            }
            catch (e) {
                throw new Error('Error deleting user from D1:');
            }
        });
    }
}
exports.default = MongoUsersService;
