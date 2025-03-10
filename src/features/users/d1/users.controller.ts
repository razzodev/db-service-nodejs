import { Request, Response } from 'express';
import D1UsersService from './users.service';


export default class D1UsersController {
    constructor(private usersService: D1UsersService) { }

    getD1Users = async (req: Request, res: Response) => {
        try {
            const d1Users = await this.usersService.getUsers();
            res.status(200).json(d1Users);
        } catch (e) {
            res.status(500).json({ message: `error getting d1 users`, error: e });
        }
    }


    getD1UserById = async (req: Request, res: Response) => {
        const userId = req.params.id;
        try {
            const d1User = await this.usersService.getUserById(userId);
            if (!d1User) {
                res.status(404).json({ message: 'D1 User not found', error: 'error getting d1 user by id' });
                return;
            }
            res.status(200).json(d1User);
        } catch (e) {
            res.status(500).json({ message: `error getting d1 user by id: ${userId}`, error: e });
        }
    }



    addD1User = async (req: Request, res: Response) => {
        const { id, username, email } = req.body;
        try {
            const result = await this.usersService.addUser({ id, username, email });
            res.status(201).json(result);
        } catch (e) {
            res.status(500).json({ message: 'error adding new d1 user', error: e });
        }
    }

    deleteD1User = async (req: Request, res: Response) => {
        const { id } = req.body;
        try {
            const result = await this.usersService.deleteUser(id);
            res.status(200).json(result);
        } catch (e) {
            res.status(500).json({ message: 'error deleting mongo user', error: e });
        }
    }
}

