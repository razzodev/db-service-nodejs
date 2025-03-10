"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupMongoRoutes = exports.MongoUsersController = exports.MongoUsersService = void 0;
var users_service_1 = require("./users.service");
Object.defineProperty(exports, "MongoUsersService", { enumerable: true, get: function () { return __importDefault(users_service_1).default; } });
var users_controller_1 = require("./users.controller");
Object.defineProperty(exports, "MongoUsersController", { enumerable: true, get: function () { return __importDefault(users_controller_1).default; } });
var users_routes_1 = require("./users.routes");
Object.defineProperty(exports, "setupMongoRoutes", { enumerable: true, get: function () { return users_routes_1.setupMongoRoutes; } });
