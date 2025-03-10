"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupD1Routes = setupD1Routes;
const express_1 = require("express");
// import userController from './users.controller';
const index_1 = require("../../../commons/middleware/index");
const router = (0, express_1.Router)();
function setupD1Routes(usersController) {
    const router = (0, express_1.Router)();
    router.get('/', usersController.getD1Users);
    router.get('/:id', (0, index_1.validateParam)(['id']), usersController.getD1UserById);
    router.post('/add', usersController.addD1User);
    router.delete('/', usersController.deleteD1User);
    return router;
}
