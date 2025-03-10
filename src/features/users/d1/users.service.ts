import { d1 } from '../../../services/db'
import { D1User, D1UserServiceType } from './types';

export default class D1UsersService implements D1UserServiceType {
    constructor(private db: typeof d1) { }
    getUsers = async () => {
        try {
            const response = await this.db.query('SELECT * FROM users');
            return response?.result[0].results as D1User[] || undefined;
        } catch (e) {
            throw new Error('Error getting users from D1:');
        }
    }
    getUserById = async (id: string) => {
        try {
            const response = await this.db.query('SELECT * FROM users WHERE id = ?', [id]);
            if (!response?.result[0].results) return undefined
            return response?.result[0].results as D1User[] || undefined;
        } catch (e) {
            throw new Error('Error getting user by id from D1:');
        }
    }
    addUser = async (user: D1User) => {
        try {
            const response = await this.db.query('INSERT INTO users (id, username, email) VALUES (?, ?, ?)', [user.id, user.username, user.email]);
            if (!response?.result[0].results) return undefined
            return response?.result[0].results as any[] || undefined;
        } catch (e) {
            throw new Error('Error adding user to D1:');
        }
    }
    deleteUser = async (id: string) => {
        try {
            const response = await this.db.query('DELETE FROM users WHERE id = ?', [id]);
            if (response?.result[0].meta?.rows_written === 0) {
                throw new Error('User not found');
            }
            return response?.result[0].results as any[] || undefined;
        } catch (e) {
            throw new Error('Error deleting user from D1:');
        }
    }
}