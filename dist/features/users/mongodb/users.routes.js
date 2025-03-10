"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupMongoRoutes = setupMongoRoutes;
const express_1 = require("express");
const index_1 = require("../../../commons/middleware/index");
function setupMongoRoutes(usersController) {
    const router = (0, express_1.Router)();
    router.get('/', usersController.getMongoUsers);
    router.get('/:id', (0, index_1.validateParam)(['id']), usersController.getMongoUserById);
    router.post('/add', usersController.addMongoUser);
    router.delete('/', usersController.deleteMongoUser);
    return router;
}
// export default router
