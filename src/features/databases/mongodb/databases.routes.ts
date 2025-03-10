// src/features/databases/mongodb/databases.routes.ts
import express from 'express';
import { MongoDatabaseController } from './databases.controller';

const router = express.Router();

export function setupMongoDatabasesRoutes(controller: MongoDatabaseController) {
    router.post('/databases', controller.createDatabase);
    router.delete('/databases/:dbName', controller.deleteDatabase);
    router.post('/collections', controller.createCollection);
    router.delete('/collections/:collectionName', controller.deleteCollection);
    // Other MongoDB database management routes...
    return router;
}
