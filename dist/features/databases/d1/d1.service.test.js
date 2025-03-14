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
// test/features/databases/d1/d1.service.test.ts
const d1_service_1 = require("./d1.service");
describe('D1DatabaseService', () => {
    let mockD1;
    let service;
    beforeEach(() => {
        mockD1 = {
            query: jest.fn(),
        };
        service = new d1_service_1.D1DatabaseService(mockD1);
    });
    describe('query', () => {
        it('should execute a query with params', () => __awaiter(void 0, void 0, void 0, function* () {
            const sql = 'SELECT * FROM users WHERE id = ?';
            const params = ['1'];
            mockD1.query.mockResolvedValue({ results: [{ id: 1, name: 'Test' }], success: true });
            const result = yield service.query(sql, params);
            expect(mockD1.query).toHaveBeenCalledWith(sql, params);
            expect(result).toEqual({ results: [{ id: 1, name: 'Test' }], success: true });
        }));
        it('should execute a query without params', () => __awaiter(void 0, void 0, void 0, function* () {
            const sql = 'SELECT * FROM users';
            mockD1.query.mockResolvedValue({ results: [{ id: 1, name: 'Test' }], success: true });
            const result = yield service.query(sql);
            expect(mockD1.query).toHaveBeenCalledWith(sql, []);
            expect(result).toEqual({ results: [{ id: 1, name: 'Test' }], success: true });
        }));
        it('should handle query errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const sql = 'INVALID SQL';
            mockD1.query.mockRejectedValue(new Error('SQL error'));
            yield expect(service.query(sql)).rejects.toThrow('SQL error');
        }));
        it('should return empty results if no data', () => __awaiter(void 0, void 0, void 0, function* () {
            const sql = 'SELECT * FROM users WHERE id = ?';
            const params = ['999'];
            mockD1.query.mockResolvedValue({ results: [], success: true });
            const result = yield service.query(sql, params);
            expect(result).toEqual({ results: [], success: true });
        }));
    });
    describe('runMigration', () => {
        it('should execute a migration query', () => __awaiter(void 0, void 0, void 0, function* () {
            const migrationSql = 'CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)';
            mockD1.query.mockResolvedValue({ success: true });
            const result = yield service.runMigration(migrationSql);
            expect(mockD1.query).toHaveBeenCalledWith(migrationSql);
            expect(result).toEqual({ success: true });
        }));
        it('should handle migration errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const migrationSql = 'INVALID SQL';
            mockD1.query.mockRejectedValue(new Error('Migration error'));
            yield expect(service.runMigration(migrationSql)).rejects.toThrow('Migration error');
        }));
    });
});
