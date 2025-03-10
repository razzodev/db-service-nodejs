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
    router.post('/databases', controller.createDatabase);
    router.delete('/databases/:dbName', controller.deleteDatabase);
    router.post('/collections', controller.createCollection);
    router.delete('/collections/:collectionName', controller.deleteCollection);
    // Other MongoDB database management routes...
    return router;
}
