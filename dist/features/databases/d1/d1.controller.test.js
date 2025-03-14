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
// test/features/databases/d1/d1.controller.test.ts
const d1_controller_1 = require("./d1.controller");
jest.mock('fs/promises'); // Mock fs/promises module
describe('D1DatabaseController', () => {
    let mockD1Service;
    let controller;
    let mockReq;
    let mockRes;
    beforeEach(() => {
        mockD1Service = {
            query: jest.fn(),
            runMigration: jest.fn(),
        };
        controller = new d1_controller_1.D1DatabaseController(mockD1Service);
        mockReq = {
            body: {},
        };
        mockRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });
    describe('query', () => {
        it('should execute a query and return results', () => __awaiter(void 0, void 0, void 0, function* () {
            mockReq.body = { sql: 'SELECT * FROM users', params: ['1'] };
            mockD1Service.query.mockResolvedValue({ results: [{ id: 1, name: 'Test' }], success: true });
            yield controller.query(mockReq, mockRes);
            expect(mockD1Service.query).toHaveBeenCalledWith('SELECT * FROM users', ['1']);
            expect(mockRes.json).toHaveBeenCalledWith({ results: [{ id: 1, name: 'Test' }], success: true });
        }));
        it('should handle query errors', () => __awaiter(void 0, void 0, void 0, function* () {
            mockReq.body = { sql: 'INVALID SQL' };
            mockD1Service.query.mockRejectedValue(new Error('SQL error'));
            yield controller.query(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'SQL syntax error' });
        }));
    });
    // describe('runMigration', () => {
    //     it('should run a migration and return success message', async () => {
    //         mockReq.body = { migrationFileName: 'test-migration.sql' };
    //         mockD1Service.runMigration.mockResolvedValue({ success: true });
    //         (fs.readFile as jest.Mock).mockResolvedValue('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)');
    //         await controller.runMigration(mockReq, mockRes);
    //         expect(mockD1Service.runMigration).toHaveBeenCalledWith('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)');
    //         expect(mockRes.json).toHaveBeenCalledWith({ message: 'Migration test-migration.sql executed', result: { success: true } });
    //     });
    //     it('should handle migration errors', async () => {
    //         mockReq.body = { migrationFileName: 'test-migration.sql' };
    //         (fs.readFile as jest.Mock).mockRejectedValue(new Error('File read error'));
    //         await controller.runMigration(mockReq, mockRes);
    //         expect(mockRes.status).toHaveBeenCalledWith(500);
    //         expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    //     });
    //     it('should handle D1 migration errors', async () => {
    //         mockReq.body = { migrationFileName: 'test-migration.sql' };
    //         (fs.readFile as jest.Mock).mockResolvedValue('INVALID SQL');
    //         mockD1Service.runMigration.mockRejectedValue(new Error('D1 Migration error'));
    //         await controller.runMigration(mockReq, mockRes);
    //         expect(mockRes.status).toHaveBeenCalledWith(500);
    //         expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    //     });
    // });
});
