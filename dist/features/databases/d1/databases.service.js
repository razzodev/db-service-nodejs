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
exports.D1DatabaseService = void 0;
class D1DatabaseService {
    constructor(db) {
        this.db = db;
        this.runMigration = (migrationSql) => __awaiter(this, void 0, void 0, function* () {
            return this.db.query(migrationSql);
        });
        // Advanced queries (joins, etc.)
        this.runAdvancedQuery = (sql_1, ...args_1) => __awaiter(this, [sql_1, ...args_1], void 0, function* (sql, params = []) {
            return this.db.query(sql, params);
        });
    }
}
exports.D1DatabaseService = D1DatabaseService;
