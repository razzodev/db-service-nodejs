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
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeFeatures = initializeFeatures;
const mongodb_1 = require("./users/mongodb");
const d1_1 = require("./users/d1");
const mongodb_2 = require("./databases/mongodb");
const d1_2 = require("./databases/d1");
const db_1 = require("../services/db");
function initializeFeatures() {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.mongodb.connectToDatabase(process.env.MONGO_DB_NAME || '');
        const mongoDb = db_1.mongodb.getDb();
        const mongoUsersService = new mongodb_1.MongoUsersService(mongoDb);
        const mongoUsersController = new mongodb_1.MongoUsersController(mongoUsersService);
        const mongoUserRoutes = (0, mongodb_1.setupMongoRoutes)(mongoUsersController);
        const d1UsersService = new d1_1.D1UsersService(d1_1.d1);
        const d1UsersController = new d1_1.D1UsersController(d1UsersService);
        const d1UserRoutes = (0, d1_1.setupD1Routes)(d1UsersController);
        const mongoDatabasesService = new mongodb_2.MongoDatabaseService(db_1.mongodb.getClient(), db_1.mongodb.getDb());
        const mongoDatabasesController = new mongodb_2.MongoDatabaseController(mongoDatabasesService);
        const mongoDatabasesRoutes = (0, mongodb_2.setupMongoDatabasesRoutes)(mongoDatabasesController);
        const d1DatabasesService = new d1_2.D1DatabaseService(d1_1.d1);
        const d1DatabasesController = new d1_2.D1DatabaseController(d1DatabasesService);
        const d1DatabasesRoutes = (0, d1_2.setupD1DatabasesRoutes)(d1DatabasesController);
        return {
            mongoUserRoutes,
            d1UserRoutes,
            mongoDatabasesRoutes,
            d1DatabasesRoutes
        };
    });
}
