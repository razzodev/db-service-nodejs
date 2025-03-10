import { Request, Response } from 'express';
import { mongodb, d1 } from '../../db/'
import { IUser } from './types';
import { ObjectId } from 'mongodb'


const getMongoUsers = async (req: Request, res: Response) => {
    try {
        const db = mongodb.getDb();
        const mongoUsers: IUser[] = await db.collection<IUser>('users').find().toArray();
        if (!mongoUsers) {
            res.status(404).json({ error: 'Mongo Users not found' });
            return;
        }
        res.status(200).json(mongoUsers);
    } catch (e) {
        res.status(500).json({ message: 'error getting mongo users', error: e });

    }
}


const getMongoUserById = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const db = mongodb.getDb();
        const mongoUser = await db.collection<IUser>('users').findOne({ _id: new ObjectId(userId) });

        if (!mongoUser) {
            res.status(404).json({ message: 'Mongo User not found', error: 'error getting mongo user by id' });
            return;
        }

        res.status(200).json(mongoUser);
    } catch (e) {
        res.status(500).json({ message: `error getting mongo user by id: ${userId}`, error: e });
    }
}

const addMongoUser = async (req: Request, res: Response) => {
    try {
        const newUser: IUser = req.body || {};
        if (!newUser) {
            res.status(400).json({ error: 'Invalid request body' });
            return;
        }
        const db = mongodb.getDb();
        const result = await db.collection<IUser>('users').insertOne(newUser);
        res.status(201).json(result);
    } catch (e) {
        res.status(500).json({ message: 'error adding new mongo user', error: e });
    }
}

const deleteMongoUser = async (req: Request, res: Response) => {
    try {
        const db = mongodb.getDb();
        const userId = new ObjectId(req.body.id);
        if (!userId) {
            res.status(400).json({ error: 'missing user id' });
            return;
        }
        const result = await db.collection<IUser>('users').deleteOne({ _id: userId });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: 'User not found', error: 'error deleting mongo user' });
            return;
        }

        res.status(200).json(result);
    } catch (e) {
        res.status(500).json({ message: 'error deleting mongo user', error: e });
    }
}


export default {
    addMongoUser,
    getMongoUsers,
    getMongoUserById,
    deleteMongoUser,
}