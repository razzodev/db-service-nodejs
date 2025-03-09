import { Request, Response } from 'express';
import { mongodb } from '../db/'
import { IUser } from './types';
import { ObjectId, WithId } from 'mongodb'


const addUser = async (req: Request, res: Response) => {
    try {
        const newUser: IUser = req.body || {};
        if (!newUser) {
            res.status(400).json({ error: 'Invalid request body' });
            return;
        }
        const db = mongodb.getDb();
        const result = await db.collection<IUser>('users').insertOne(newUser);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getUsers = async (req: Request, res: Response) => {
    try {
        const db = mongodb.getDb();
        const users: IUser[] = await db.collection<IUser>('users').find().toArray();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', e: error });
    }
}

const getUserById = async (req: Request, res: Response) => {
    try {
        const db = mongodb.getDb();
        const userId = new ObjectId(req.params.id);

        if (!userId) {
            res.status(400).json({ error: 'missing user id' });
            return;
        }
        const user = await db.collection<IUser>('users').findOne({ _id: userId });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        const db = mongodb.getDb();
        const userId = new ObjectId(req.params.id);
        if (!userId) {
            res.status(400).json({ error: 'missing user id' });
            return;
        }
        const result = await db.collection<IUser>('users').deleteOne({ _id: userId });
        if (result.deletedCount === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default {
    addUser,
    getUsers,
    getUserById,
    deleteUser
}