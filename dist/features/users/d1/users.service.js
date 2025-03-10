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
class D1UsersService {
    constructor(db) {
        this.db = db;
        this.getUsers = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.db.query('SELECT * FROM users');
                return (response === null || response === void 0 ? void 0 : response.result[0].results) || undefined;
            }
            catch (e) {
                throw new Error('Error getting users from D1:');
            }
        });
        this.getUserById = (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.db.query('SELECT * FROM users WHERE id = ?', [id]);
                if (!(response === null || response === void 0 ? void 0 : response.result[0].results))
                    return undefined;
                return (response === null || response === void 0 ? void 0 : response.result[0].results) || undefined;
            }
            catch (e) {
                throw new Error('Error getting user by id from D1:');
            }
        });
        this.addUser = (user) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.db.query('INSERT INTO users (id, username, email) VALUES (?, ?, ?)', [user.id, user.username, user.email]);
                if (!(response === null || response === void 0 ? void 0 : response.result[0].results))
                    return undefined;
                return (response === null || response === void 0 ? void 0 : response.result[0].results) || undefined;
            }
            catch (e) {
                throw new Error('Error adding user to D1:');
            }
        });
        this.deleteUser = (id) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const response = yield this.db.query('DELETE FROM users WHERE id = ?', [id]);
                if (((_a = response === null || response === void 0 ? void 0 : response.result[0].meta) === null || _a === void 0 ? void 0 : _a.rows_written) === 0) {
                    throw new Error('User not found');
                }
                return (response === null || response === void 0 ? void 0 : response.result[0].results) || undefined;
            }
            catch (e) {
                throw new Error('Error deleting user from D1:');
            }
        });
    }
}
exports.default = D1UsersService;
