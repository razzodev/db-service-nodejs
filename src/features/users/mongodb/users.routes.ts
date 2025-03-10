import { Router } from "express";
import { validateParam } from '../../../commons/middleware/index';
import MongoUsersController from './users.controller';


export function setupMongoRoutes(usersController: MongoUsersController) {
    const router = Router();
    router.get('/', usersController.getMongoUsers);
    router.get('/:id', validateParam(['id']), usersController.getMongoUserById);
    router.post('/add', usersController.addMongoUser);
    router.delete('/', usersController.deleteMongoUser);
    return router;
}

// export default router