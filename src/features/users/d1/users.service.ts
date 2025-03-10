import { d1 } from '../../db/'
import { D1User, D1UserServiceType } from './types';

export default class D1UsersService implements D1UserServiceType {
    constructor() { }
    async getUsers() {
        try {
            const response = await d1.query('SELECT * FROM users');
            return response?.result[0].results as D1User[] || undefined;
        } catch (e) {
            throw new Error('Error getting users from D1:');
        }
    }
    async getUserById(id: string) {
        try {
            const response = await d1.query('SELECT * FROM users WHERE id = ?', [id]);
            if (!response?.result[0].results) return undefined
            return response?.result[0].results as D1User[] || undefined;
        } catch (e) {
            throw new Error('Error getting user by id from D1:');
        }
    }
    async addUser(user: D1User) {
        try {
            const response = await d1.query('INSERT INTO users (id, username, email) VALUES (?, ?, ?)', [user.id, user.username, user.email]);
            if (!response?.result[0].results) return undefined
            return response?.result[0].results as any[] || undefined;
        } catch (e) {
            throw new Error('Error adding user to D1:');
        }
    }
    async deleteUser(id: string) {
        try {
            const response = await d1.query('DELETE FROM users WHERE id = ?', [id]);
            if (response?.result[0].meta?.rows_written === 0) {
                throw new Error('User not found');
            }
            return response?.result[0].results as any[] || undefined;
        } catch (e) {
            throw new Error('Error deleting user from D1:');
        }
    }
}