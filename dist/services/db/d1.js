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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.d1 = void 0;
exports.getD1Client = getD1Client;
const cloudflare_1 = __importDefault(require("cloudflare"));
const config_1 = __importDefault(require("../../config"));
const client = new cloudflare_1.default({
    apiEmail: process.env.CF_API_EMAIL || '',
    apiKey: process.env.CF_API_KEY || '',
});
function getD1Client() {
    return new cloudflare_1.default({
        apiEmail: process.env.CF_API_EMAIL || '',
        apiKey: process.env.CF_API_KEY || '',
    });
}
const { cf } = config_1.default;
function query(sql_1) {
    return __awaiter(this, arguments, void 0, function* (sql, params = [], // Allow more parameter types
    databaseId = cf.databaseId, accountId = cf.accountId) {
        try {
            const response = yield client.d1.database.query(databaseId, {
                account_id: accountId,
                sql: sql,
                params: params, // Correctly pass the params
            });
            return response;
        }
        catch (e) {
            console.error('Error querying D1:', e);
            throw e; // Rethrow the error for the service to handle
        }
    });
}
exports.d1 = {
    query,
};
