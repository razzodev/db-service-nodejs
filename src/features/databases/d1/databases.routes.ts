// src/features/databases/d1/databases.routes.ts
import express from 'express';
import { D1DatabaseController } from './databases.controller'

const router = express.Router();

export function setupD1DatabasesRoutes(controller: D1DatabaseController) {
    router.post('/migrations', controller.runMigration);
    router.post('/queries', controller.runAdvancedQuery);

    // Other D1 database management routes...
    return router;
}