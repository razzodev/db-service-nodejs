"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupMongoDatabasesRoutes = setupMongoDatabasesRoutes;
// src/features/databases/mongodb/databases.routes.ts
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
function setupMongoDatabasesRoutes(controller) {
    router.post('/insertOne', controller.insertOne);
    router.post('/insertMany', controller.insertMany);
    router.post('/deleteOne', controller.deleteOne);
    router.post('/updateOne', controller.updateOne);
    router.post('/find', controller.find);
    router.post('/createDatabase', controller.createDatabase);
    router.delete('/deleteDatabase/:dbName', controller.deleteDatabase);
    router.post('/createCollection', controller.createCollection);
    router.delete('/deleteCollection/:dbName/:collectionName', controller.deleteCollection);
    return router;
}
exports.default = router;
