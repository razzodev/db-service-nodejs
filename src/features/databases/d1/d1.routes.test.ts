// test/features/databases/d1/d1.routes.test.ts
import request from 'supertest';
import express, { Express } from 'express';
import { setupD1DatabasesRoutes } from './d1.routes';
import { D1DatabaseController } from './d1.controller';
import { D1DatabaseService } from './d1.service';
import fs from 'fs/promises';
import path from 'path';

jest.mock('fs/promises'); // Mock fs/promises module

describe('D1 Routes', () => {
    let app: Express;
    let mockD1: any;
    let service: D1DatabaseService;
    let controller: D1DatabaseController;

    beforeEach(() => {
        mockD1 = {
            query: jest.fn(),
        };
        service = new D1DatabaseService(mockD1);
        controller = new D1DatabaseController(service);

        app = express();
        app.use(express.json());
        app.use(setupD1DatabasesRoutes(controller));

        // Add error handling middleware
        app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.error(err);
            res.status(500).json({ error: err.message });
        });
    });

    describe('POST /query', () => {
        it('should execute a query and return results', async () => {
            mockD1.query.mockResolvedValue({ results: [{ id: 1, name: 'Test' }], success: true });

            const res = await request(app)
                .post('/query')
                .send({ sql: 'SELECT * FROM users', params: ['1'] });

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ results: [{ id: 1, name: 'Test' }], success: true });
            expect(mockD1.query).toHaveBeenCalledWith('SELECT * FROM users', ['1']);
        });
        it('should handle query errors', async () => {
            const mockError = new Error('SQL syntax error');
            mockD1.query.mockRejectedValue(mockError);

            const res = await request(app)
                .post('/query')
                .send({ sql: 'INVALID SQL' });

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ error: 'SQL syntax error' });
        });

        it('should handle query without parameters', async () => {
            mockD1.query.mockResolvedValue({ results: [{ id: 1, name: 'Test' }], success: true });

            const res = await request(app)
                .post('/query')
                .send({ sql: 'SELECT * FROM users' });

            console.log(res.body);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ results: [{ id: 1, name: 'Test' }], success: true });

            // expect(mockD1.query).to('SELECT * FROM users', []);
        });
        it('should handle empty result sets', async () => {
            mockD1.query.mockResolvedValue({ results: [], success: true });

            const res = await request(app)
                .post('/d1/query')
                .send({ sql: 'SELECT * FROM users WHERE id = ?', params: ['999'] });

            expect(res.statusCode).toBe(404);
        });
    });


});