// src/features/databases/mongodb/databases.routes.ts
import express from 'express';
import { MongoDatabaseController } from './mongodb.controller';

const router = express.Router();

export function setupMongoDatabasesRoutes(controller: MongoDatabaseController) {
    router.post('/insertOne', controller.insertOne);
    router.post('/insertMany', controller.insertMany);
    router.post('/deleteOne', controller.deleteOne);
    router.post('/updateOne', controller.updateOne);
    router.post('/updateMany', controller.updateMany);
    router.post('/find', controller.find);
    router.post('/createDatabase', controller.createDatabase);
    router.delete('/deleteDatabase/:database', controller.deleteDatabase);
    router.post('/createCollection', controller.createCollection);
    router.delete('/deleteCollection/:database/:collection', controller.deleteCollection);
    return router;
}



export default router;
