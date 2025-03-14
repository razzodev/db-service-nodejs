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
// test/features/databases/d1/d1.routes.test.ts
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const d1_routes_1 = require("./d1.routes");
const d1_controller_1 = require("./d1.controller");
const d1_service_1 = require("./d1.service");
jest.mock('fs/promises'); // Mock fs/promises module
describe('D1 Routes', () => {
    let app;
    let mockD1;
    let service;
    let controller;
    beforeEach(() => {
        mockD1 = {
            query: jest.fn(),
        };
        service = new d1_service_1.D1DatabaseService(mockD1);
        controller = new d1_controller_1.D1DatabaseController(service);
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use((0, d1_routes_1.setupD1DatabasesRoutes)(controller));
        // Add error handling middleware
        app.use((err, req, res, next) => {
            console.error(err);
            res.status(500).json({ error: err.message });
        });
    });
    describe('POST /query', () => {
        it('should execute a query and return results', () => __awaiter(void 0, void 0, void 0, function* () {
            mockD1.query.mockResolvedValue({ results: [{ id: 1, name: 'Test' }], success: true });
            const res = yield (0, supertest_1.default)(app)
                .post('/query')
                .send({ sql: 'SELECT * FROM users', params: ['1'] });
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ results: [{ id: 1, name: 'Test' }], success: true });
            expect(mockD1.query).toHaveBeenCalledWith('SELECT * FROM users', ['1']);
        }));
        it('should handle query errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = new Error('SQL syntax error');
            mockD1.query.mockRejectedValue(mockError);
            const res = yield (0, supertest_1.default)(app)
                .post('/query')
                .send({ sql: 'INVALID SQL' });
            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ error: 'SQL syntax error' });
        }));
        it('should handle query without parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            mockD1.query.mockResolvedValue({ results: [{ id: 1, name: 'Test' }], success: true });
            const res = yield (0, supertest_1.default)(app)
                .post('/query')
                .send({ sql: 'SELECT * FROM users' });
            console.log(res.body);
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ results: [{ id: 1, name: 'Test' }], success: true });
            // expect(mockD1.query).to('SELECT * FROM users', []);
        }));
        it('should handle empty result sets', () => __awaiter(void 0, void 0, void 0, function* () {
            mockD1.query.mockResolvedValue({ results: [], success: true });
            const res = yield (0, supertest_1.default)(app)
                .post('/d1/query')
                .send({ sql: 'SELECT * FROM users WHERE id = ?', params: ['999'] });
            expect(res.statusCode).toBe(404);
        }));
    });
});
