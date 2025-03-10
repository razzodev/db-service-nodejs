// src/features/databases/mongodb/databases.controller.ts
import { Request, Response } from 'express';
import { MongoDatabaseService } from './databases.service';

export class MongoDatabaseController {
    constructor(private databaseService: MongoDatabaseService) { }

    createDatabase = async (req: Request, res: Response) => {
        try {
            const { dbName } = req.body;
            const db = await this.databaseService.createDatabase(dbName);
            res.status(201).json({ message: `Database ${dbName} created`, dbName: db.databaseName });
        } catch (error) {
            console.error('Error creating MongoDB database:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    deleteDatabase = async (req: Request, res: Response) => {
        try {
            const { dbName } = req.params;
            await this.databaseService.deleteDatabase(dbName);
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting MongoDB database:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    createCollection = async (req: Request, res: Response) => {
        try {
            const { collectionName } = req.body;
            const collection = await this.databaseService.createCollection(collectionName);
            res.status(201).json({ message: `Collection ${collectionName} created`, collectionName: collection.collectionName });
        } catch (error) {
            console.error('Error creating MongoDB collection:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    deleteCollection = async (req: Request, res: Response) => {
        try {
            const { collectionName } = req.params;
            await this.databaseService.deleteCollection(collectionName);
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting MongoDB collection:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Other MongoDB database management controller methods...
}
