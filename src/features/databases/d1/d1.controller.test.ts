// test/features/databases/d1/d1.controller.test.ts
import { D1DatabaseController } from './d1.controller';
import { D1DatabaseService } from './d1.service';
import fs from 'fs/promises';
import path from 'path';

jest.mock('fs/promises'); // Mock fs/promises module

describe('D1DatabaseController', () => {
    let mockD1Service: any;
    let controller: D1DatabaseController;
    let mockReq: any;
    let mockRes: any;

    beforeEach(() => {
        mockD1Service = {
            query: jest.fn(),
            runMigration: jest.fn(),
        };
        controller = new D1DatabaseController(mockD1Service);

        mockReq = {
            body: {},
        };
        mockRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    describe('query', () => {
        it('should execute a query and return results', async () => {
            mockReq.body = { sql: 'SELECT * FROM users', params: ['1'] };
            mockD1Service.query.mockResolvedValue({ results: [{ id: 1, name: 'Test' }], success: true });

            await controller.query(mockReq, mockRes);

            expect(mockD1Service.query).toHaveBeenCalledWith('SELECT * FROM users', ['1']);
            expect(mockRes.json).toHaveBeenCalledWith({ results: [{ id: 1, name: 'Test' }], success: true });
        });

        it('should handle query errors', async () => {
            mockReq.body = { sql: 'INVALID SQL' };
            mockD1Service.query.mockRejectedValue(new Error('SQL error'));

            await controller.query(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'SQL syntax error' });
        });
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