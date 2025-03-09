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
require("./config");
const express_1 = __importDefault(require("express"));
const db_1 = require("./features/db");
const users_routes_1 = __importDefault(require("./features/users/users.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use(express_1.default.json());
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield db_1.mongodb.connectToDatabase('app');
            app.use('/users', users_routes_1.default);
            app.get('/', (req, res) => {
                res.json('Hello, World!');
            });
            app.listen(PORT, () => {
                console.log(`Server listening on port ${PORT}`);
            });
            process.on('SIGINT', () => __awaiter(this, void 0, void 0, function* () {
                console.log('Closing mongodbDB connection...');
                yield db_1.mongodb.closeDatabaseConnection();
                process.exit();
            }));
        }
        catch (error) {
            console.error('Failed to start server:', error);
        }
    });
}
startServer();
