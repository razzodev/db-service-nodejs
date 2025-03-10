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
class MongoUsersController {
    constructor(usersService) {
        this.usersService = usersService;
        this.getMongoUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const mongoUsers = yield this.usersService.getUsers();
                if (!mongoUsers) {
                    res.status(404).json({ error: 'Mongo Users not found' });
                    return;
                }
                res.status(200).json(mongoUsers);
            }
            catch (e) {
                res.status(500).json({ message: 'error getting mongo users', error: e });
            }
        });
        this.getMongoUserById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            try {
                const mongoUser = yield this.usersService.getUserById(userId);
                if (!mongoUser) {
                    res.status(404).json({ message: 'Mongo User not found', error: 'error getting mongo user by id' });
                    return;
                }
                res.status(200).json(mongoUser);
            }
            catch (e) {
                res.status(500).json({ message: `error getting mongo user by id: ${userId}`, error: e });
            }
        });
        this.addMongoUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = req.body || {};
                if (!newUser) {
                    res.status(400).json({ error: 'Invalid request body' });
                    return;
                }
                const result = yield this.usersService.addUser(newUser);
                res.status(201).json(result);
            }
            catch (e) {
                res.status(500).json({ message: 'error adding new mongo user', error: e });
            }
        });
        this.deleteMongoUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.body.id;
                if (!userId) {
                    res.status(400).json({ error: 'missing user id' });
                    return;
                }
                const result = yield this.usersService.deleteUser(userId);
                if (!result) {
                    res.status(404).json({ message: 'User not found', error: 'error deleting mongo user' });
                    return;
                }
                ``;
                res.status(200).json(result);
            }
            catch (e) {
                res.status(500).json({ message: 'error deleting mongo user', error: e });
            }
        });
    }
}
exports.default = MongoUsersController;
;
