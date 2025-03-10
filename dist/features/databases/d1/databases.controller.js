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
exports.D1DatabaseController = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
class D1DatabaseController {
    constructor(databaseService) {
        this.databaseService = databaseService;
        this.runMigration = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { migrationFileName } = req.body;
                const migrationFilePath = path_1.default.join(__dirname, 'migrations', migrationFileName);
                const migrationSql = yield promises_1.default.readFile(migrationFilePath, 'utf-8');
                const result = yield this.databaseService.runMigration(migrationSql);
                res.status(200).json({ message: `Migration ${migrationFileName} executed`, result });
            }
            catch (error) {
                console.error('Error running D1 migration:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        this.runAdvancedQuery = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { sql, params } = req.body;
                const result = yield this.databaseService.runAdvancedQuery(sql, params);
                res.status(200).json({ result });
            }
            catch (error) {
                console.error('Error running D1 advanced query:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.D1DatabaseController = D1DatabaseController;
