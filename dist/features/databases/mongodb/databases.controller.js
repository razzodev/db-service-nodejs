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
exports.MongoDatabaseController = void 0;
class MongoDatabaseController {
    constructor(databaseService) {
        this.databaseService = databaseService;
        this.createDatabase = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { dbName } = req.body;
                const db = yield this.databaseService.createDatabase(dbName);
                res.status(201).json({ message: `Database ${dbName} created`, dbName: db.databaseName });
            }
            catch (error) {
                console.error('Error creating MongoDB database:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        this.deleteDatabase = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { dbName } = req.params;
                yield this.databaseService.deleteDatabase(dbName);
                res.status(204).send();
            }
            catch (error) {
                console.error('Error deleting MongoDB database:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        this.createCollection = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { collectionName } = req.body;
                const collection = yield this.databaseService.createCollection(collectionName);
                res.status(201).json({ message: `Collection ${collectionName} created`, collectionName: collection.collectionName });
            }
            catch (error) {
                console.error('Error creating MongoDB collection:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        this.deleteCollection = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { collectionName } = req.params;
                yield this.databaseService.deleteCollection(collectionName);
                res.status(204).send();
            }
            catch (error) {
                console.error('Error deleting MongoDB collection:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.MongoDatabaseController = MongoDatabaseController;
