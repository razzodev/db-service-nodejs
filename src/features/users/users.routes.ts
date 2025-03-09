import { Router, Request, Response } from "express";
import { mongodb } from '../db'
import userController from './users.controller';

const router = Router();

router.post('/add', userController.addUser);

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.delete('/:id', userController.deleteUser);

export default router