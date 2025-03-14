// test/features/databases/d1/d1.service.test.ts
import { D1DatabaseService } from './d1.service';

describe('D1DatabaseService', () => {
    let mockD1: any;
    let service: D1DatabaseService;

    beforeEach(() => {
        mockD1 = {
            query: jest.fn(),
        };
        service = new D1DatabaseService(mockD1);
    });

    describe('query', () => {
        it('should execute a query with params', async () => {
            const sql = 'SELECT * FROM users WHERE id = ?';
            const params = ['1'];
            mockD1.query.mockResolvedValue({ results: [{ id: 1, name: 'Test' }], success: true });

            const result = await service.query(sql, params);

            expect(mockD1.query).toHaveBeenCalledWith(sql, params);
            expect(result).toEqual({ results: [{ id: 1, name: 'Test' }], success: true });
        });

        it('should execute a query without params', async () => {
            const sql = 'SELECT * FROM users';
            mockD1.query.mockResolvedValue({ results: [{ id: 1, name: 'Test' }], success: true });

            const result = await service.query(sql);

            expect(mockD1.query).toHaveBeenCalledWith(sql, []);
            expect(result).toEqual({ results: [{ id: 1, name: 'Test' }], success: true });
        });

        it('should handle query errors', async () => {
            const sql = 'INVALID SQL';
            mockD1.query.mockRejectedValue(new Error('SQL error'));

            await expect(service.query(sql)).rejects.toThrow('SQL error');
        });

        it('should return empty results if no data', async () => {
            const sql = 'SELECT * FROM users WHERE id = ?';
            const params = ['999'];
            mockD1.query.mockResolvedValue({ results: [], success: true });

            const result = await service.query(sql, params);

            expect(result).toEqual({ results: [], success: true });
        });
    });

    describe('runMigration', () => {
        it('should execute a migration query', async () => {
            const migrationSql = 'CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)';
            mockD1.query.mockResolvedValue({ success: true });

            const result = await service.runMigration(migrationSql);

            expect(mockD1.query).toHaveBeenCalledWith(migrationSql);
            expect(result).toEqual({ success: true });
        });

        it('should handle migration errors', async () => {
            const migrationSql = 'INVALID SQL';
            mockD1.query.mockRejectedValue(new Error('Migration error'));

            await expect(service.runMigration(migrationSql)).rejects.toThrow('Migration error');
        });
    });
});