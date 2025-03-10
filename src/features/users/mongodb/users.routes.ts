import { Router } from "express";
import userController from './users.controller';
import { validateParam } from '../../../commons/middleware/index';

const { getMongoUsers, getMongoUserById, addMongoUser, deleteMongoUser } = userController
const router = Router();

router.get('/', getMongoUsers);
router.get('/:id', validateParam(['id']), getMongoUserById);
router.post('/add', addMongoUser);
router.delete('/', deleteMongoUser);


export default router