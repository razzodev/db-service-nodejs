"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = cloudflareConfig;
function cloudflareConfig() {
    return {
        databaseId: process.env.CF_DB_ID || '',
        accountId: 'd4d4d8796d89d871ee09ce81f93bae3e',
        email: process.env.CF_API_EMAIL || '',
    };
}
