import { Request, Response } from 'express';
import { mongodb } from '../../../services/db'
import { IUser } from './types';
import { ObjectId } from 'mongodb'
import MongoUsersService from './users.service';


export default class MongoUsersController {
    constructor(private usersService: MongoUsersService) { }
    getMongoUsers = async (req: Request, res: Response) => {
        try {
            const mongoUsers = await this.usersService.getUsers();
            if (!mongoUsers) {
                res.status(404).json({ error: 'Mongo Users not found' });
                return;
            }
            res.status(200).json(mongoUsers);
        } catch (e) {
            res.status(500).json({ message: 'error getting mongo users', error: e });
        }
    }


    getMongoUserById = async (req: Request, res: Response) => {
        const userId = req.params.id;
        try {
            const mongoUser = await this.usersService.getUserById(userId);
            if (!mongoUser) {
                res.status(404).json({ message: 'Mongo User not found', error: 'error getting mongo user by id' });
                return;
            }

            res.status(200).json(mongoUser);
        } catch (e) {
            res.status(500).json({ message: `error getting mongo user by id: ${userId}`, error: e });
        }
    }

    addMongoUser = async (req: Request, res: Response) => {
        try {
            const newUser = req.body || {};
            if (!newUser) {
                res.status(400).json({ error: 'Invalid request body' });
                return;
            }
            const result = await this.usersService.addUser(newUser);
            res.status(201).json(result);
        } catch (e) {
            res.status(500).json({ message: 'error adding new mongo user', error: e });
        }
    }

    deleteMongoUser = async (req: Request, res: Response) => {
        try {
            const userId = req.body.id;
            if (!userId) {
                res.status(400).json({ error: 'missing user id' });
                return;
            }
            const result = await this.usersService.deleteUser(userId);
            if (!result) {
                res.status(404).json({ message: 'User not found', error: 'error deleting mongo user' });
                return;
            } ``
            res.status(200).json(result);
        } catch (e) {
            res.status(500).json({ message: 'error deleting mongo user', error: e });
        }
    }
}
;