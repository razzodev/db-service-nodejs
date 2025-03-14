// src/features/databases/mongodb/databases.controller.ts
import { Request, Response } from 'express';
import { MongoDatabaseService } from './mongodb.service';
import { ObjectId } from 'mongodb';

export class MongoDatabaseController {
    constructor(private databaseService: MongoDatabaseService) { }

    find = async (req: Request, res: Response) => {
        try {
            const { database, collection, query } = req.body;
            let result;
            if (query === 'all') {
                result = await this.databaseService.findAll(database, collection);
            } else if (query && query._id) {
                result = await this.databaseService.findOne(database, collection, { _id: new ObjectId(query._id) });
            } else {
                result = await this.databaseService.find(database, collection, query);
            }
            res.status(200).json(result);
        } catch (error: any) {
            console.error('MongoDB find error:', error);
            res.status(500).json({ error: error.message });
        }
    };

    deleteOne = async (req: Request, res: Response) => {
        try {
            const { database, collection, id } = req.body;
            const result = await this.databaseService.deleteOne(database, collection, { _id: new ObjectId(id) });
            res.status(200).json(result);
        } catch (error: any) {
            console.error('MongoDB deleteOne error:', error);
            res.status(500).json({ error: error.message });
        }
    };

    deleteMany = async (req: Request, res: Response) => {
        try {
            const { database, collection, filter } = req.body;
            const result = await this.databaseService.deleteMany(database, collection, filter);
            res.status(200).json(result);
        } catch (error: any) {
            console.error('MongoDB deleteMany error:', error);
            res.status(500).json({ error: error.message });
        }
    }
    insertOne = async (req: Request, res: Response) => {
        try {
            const { database, collection, document } = req.body;
            const result = await this.databaseService.insertOne(database, collection, document);
            res.status(201).json(result);
        } catch (error: any) {
            console.error('MongoDB insertOne error:', error);
            res.status(500).json({ error: error.message });
        }
    };

    insertMany = async (req: Request, res: Response) => {
        try {
            const { database, collection, documents } = req.body;
            const result = await this.databaseService.insertMany(database, collection, documents);
            res.status(201).json(result);
        } catch (error: any) {
            console.error('MongoDB insertMany error:', error);
            res.status(500).json({ error: error.message });
        }
    };


    updateOne = async (req: Request, res: Response) => {
        try {
            const { database, collection, _id, update } = req.body;
            const result = await this.databaseService.updateOne(database, collection, { _id: new ObjectId(_id) }, update);
            res.status(200).json(result);
        } catch (error: any) {
            console.error('MongoDB updateOne error:', error);
            res.status(500).json({ error: error.message });
        }
    };
    updateMany = async (req: Request, res: Response) => {
        try {
            const { database, collection, filter, update, options } = req.body;
            const result = await this.databaseService.updateMany(database, collection, filter, update, options);
            res.status(200).json(result);
        } catch (error: any) {
            console.error('MongoDB updateMany error:', error);
            res.status(500).json({ error: error.message });
        }
    }


    createDatabase = async (req: Request, res: Response) => {
        try {
            const { database } = req.body;
            const db = await this.databaseService.createDatabase(database);
            res.status(201).json({ message: `Database ${database} created`, dbName: db.databaseName });
        } catch (error) {
            console.error('Error creating MongoDB database:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    deleteDatabase = async (req: Request, res: Response) => {
        try {
            const { database } = req.params;
            await this.databaseService.deleteDatabase(database);
            res.status(204).json();
        } catch (error) {
            console.error('Error deleting MongoDB database:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    createCollection = async (req: Request, res: Response) => {
        try {
            const { database, collection } = req.body;
            const col = await this.databaseService.createCollection(database, collection);
            res.status(201).json({ message: `Collection ${collection} created`, collectionName: col.collectionName });
        } catch (error) {
            console.error('Error creating MongoDB collection:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    deleteCollection = async (req: Request, res: Response) => {
        try {
            const { database, collection } = req.params;
            await this.databaseService.deleteCollection(database, collection);
            res.status(204).json();
        } catch (error) {
            console.error('Error deleting MongoDB collection:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}