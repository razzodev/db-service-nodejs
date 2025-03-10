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
class D1UsersController {
    constructor(usersService) {
        this.usersService = usersService;
        this.getD1Users = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const d1Users = yield this.usersService.getUsers();
                res.status(200).json(d1Users);
            }
            catch (e) {
                res.status(500).json({ message: `error getting d1 users`, error: e });
            }
        });
        this.getD1UserById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            try {
                const d1User = yield this.usersService.getUserById(userId);
                if (!d1User) {
                    res.status(404).json({ message: 'D1 User not found', error: 'error getting d1 user by id' });
                    return;
                }
                res.status(200).json(d1User);
            }
            catch (e) {
                res.status(500).json({ message: `error getting d1 user by id: ${userId}`, error: e });
            }
        });
        this.addD1User = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id, username, email } = req.body;
            try {
                const result = yield this.usersService.addUser({ id, username, email });
                res.status(201).json(result);
            }
            catch (e) {
                res.status(500).json({ message: 'error adding new d1 user', error: e });
            }
        });
        this.deleteD1User = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            try {
                const result = yield this.usersService.deleteUser(id);
                res.status(200).json(result);
            }
            catch (e) {
                res.status(500).json({ message: 'error deleting mongo user', error: e });
            }
        });
    }
}
exports.default = D1UsersController;
