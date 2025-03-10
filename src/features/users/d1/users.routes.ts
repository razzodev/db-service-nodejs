import { Router, Request, Response } from "express";
import userController from './users.controller';
import { validateParam } from '../../../commons/middleware/index';
const { getD1Users, getD1UserById, addD1User, deleteD1User } = userController

const router = Router();

router.get('/', getD1Users);
router.get('/:id', validateParam(['id']), getD1UserById);
router.post('/add', addD1User);
router.delete('/', deleteD1User);

export default router