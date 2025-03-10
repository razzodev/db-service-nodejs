import { Request, Response } from 'express';
import { d1 } from '../../db/'

const getD1Users = async (req: Request, res: Response) => {
    try {
        const d1Users = await d1.query('SELECT * FROM users');
        res.status(200).json(d1Users?.result[0].results);
    } catch (e) {
        res.status(500).json({ message: `error getting d1 users`, error: e });
    }
}


const getD1UserById = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const d1User = await d1.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (!d1User) {
            res.status(404).json({ message: 'D1 User not found', error: 'error getting d1 user by id' });
            return;
        }
        res.status(200).json(d1User.result[0].results);
    } catch (e) {
        res.status(500).json({ message: `error getting d1 user by id: ${userId}`, error: e });
    }
}



const addD1User = async (req: Request, res: Response) => {
    const { id, username, email } = req.body;
    try {
        const result = await d1.query('INSERT INTO users (id, username, email) VALUES (?, ?, ?)', [id, username, email]);

        res.status(201).json(result?.result[0].results);
    } catch (e) {
        res.status(500).json({ message: 'error adding new d1 user', error: e });
    }
}

const deleteD1User = async (req: Request, res: Response) => {
    const { id } = req.body;
    try {

        const result = await d1.query('DELETE FROM users WHERE id = ?', [id]);
        if (result?.result[0].meta?.rows_written === 0) {
            res.status(404).json({ message: 'User not found', error: 'error deleting d1 user' });
            return;
        }

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