import { Request, Response } from 'express';
import { d1 } from '../../db/'
import D1UsersService from './users.service';
const usersService = new D1UsersService();

const getD1Users = async (req: Request, res: Response) => {
    try {
        const d1Users = await usersService.getUsers();
        res.status(200).json(d1Users);
    } catch (e) {
        res.status(500).json({ message: `error getting d1 users`, error: e });
    }
}


const getD1UserById = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const d1User = await usersService.getUserById(userId);
        if (!d1User) {
            res.status(404).json({ message: 'D1 User not found', error: 'error getting d1 user by id' });
            return;
        }
        res.status(200).json(d1User);
    } catch (e) {
        res.status(500).json({ message: `error getting d1 user by id: ${userId}`, error: e });
    }
}



const addD1User = async (req: Request, res: Response) => {
    const { id, username, email } = req.body;
    try {
        const result = await usersService.addUser({ id, username, email });
        res.status(201).json(result);
    } catch (e) {
        res.status(500).json({ message: 'error adding new d1 user', error: e });
    }
}

const deleteD1User = async (req: Request, res: Response) => {
    const { id } = req.body;
    try {
        const result = await usersService.deleteUser(id);
        res.status(200).json(result);
    } catch (e) {
        res.status(500).json({ message: 'error deleting mongo user', error: e });
    }
}

export default {
    getD1Users,
    getD1UserById,
    addD1User,
    deleteD1User
}