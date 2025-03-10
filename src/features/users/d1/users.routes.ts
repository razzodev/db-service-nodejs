import { Router, Request, Response } from "express";
// import userController from './users.controller';
import { validateParam } from '../../../commons/middleware/index';
import MongoUsersController from './users.controller'

const router = Router();

export function setupD1Routes(usersController: MongoUsersController) {
    const router = Router();
    router.get('/', usersController.getD1Users);
    router.get('/:id', validateParam(['id']), usersController.getD1UserById);
    router.post('/add', usersController.addD1User);
    router.delete('/', usersController.deleteD1User);
    return router;
}