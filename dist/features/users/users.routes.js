"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = __importDefault(require("./users.controller"));
const router = (0, express_1.Router)();
router.post('/add', users_controller_1.default.addUser);
router.get('/', users_controller_1.default.getUsers);
router.get('/:id', users_controller_1.default.getUserById);
router.delete('/:id', users_controller_1.default.deleteUser);
exports.default = router;
