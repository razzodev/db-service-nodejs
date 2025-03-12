"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupD1DatabasesRoutes = setupD1DatabasesRoutes;
// src/features/databases/d1/databases.routes.ts
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
function setupD1DatabasesRoutes(controller) {
    router.post('/query', controller.query);
    router.post('/migrations', controller.runMigration);
    return router;
}
