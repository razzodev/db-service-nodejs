// src/features/databases/d1/databases.routes.ts
import express from 'express';
import { D1DatabaseController } from './d1.controller'

const router = express.Router();

export function setupD1DatabasesRoutes(controller: D1DatabaseController) {
    router.post('/query', controller.query);
    router.post('/migrations', controller.runMigration);

    return router;
}