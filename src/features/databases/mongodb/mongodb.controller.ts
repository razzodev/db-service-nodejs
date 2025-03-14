// src/features/databases/mongodb/databases.controller.ts
import { Request, Response } from 'express';
import { MongoDatabaseService } from './mongodb.service';
import { ObjectId } from 'mongodb';

export class MongoDatabaseController {
    constructor(private databaseService: MongoDatabaseService) { }

    insertOne = async (req: Request, res: Response) => {
        try {
            const { database, collection, document } = req.body;
            const result = await this.databaseService.insertOne(database, collection, document);
            res.json(result);
        } catch (error: any) {
            console.error('MongoDB insertOne error:', error);
            res.status(500).json({ error: error.message });
        }
    };

    insertMany = async (req: Request, res: Response) => {
        try {
            const { database, collection, documents } = req.body;
            const result = await this.databaseService.insertMany(database, collection, documents);
            res.json(result);
        } catch (error: any) {
            console.error('MongoDB insertMany error:', error);
            res.status(500).json({ error: error.message });
        }
    };

    deleteOne = async (req: Request, res: Response) => {
        try {
            const { database, collection, id } = req.body;
            const result = await this.databaseService.deleteOne(database, collection, { _id: new ObjectId(id) });
            res.json(result);
        } catch (error: any) {
            console.error('MongoDB deleteOne error:', error);
            res.status(500).json({ error: error.message });
        }
    };

    updateOne = async (req: Request, res: Response) => {
        try {
            const { database, collection, _id, updateDocument } = req.body;
            const result = await this.databaseService.updateOne(database, collection, { _id: new ObjectId(_id) }, updateDocument);
            res.json(result);
        } catch (error: any) {
            console.error('MongoDB updateOne error:', error);
            res.status(500).json({ error: error.message });
        }
    };
    updateMany = async (req: Request, res: Response) => {
        try {
            const { database, collection, filter, updateDocument, options } = req.body;
            const result = await this.databaseService.updateMany(database, collection, filter, updateDocument, options);
            res.json(result);
        } catch (error: any) {
            console.error('MongoDB updateMany error:', error);
            res.status(500).json({ error: error.message });
        }
    }

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
            res.json(result);
        } catch (error: any) {
            console.error('MongoDB find error:', error);
            res.status(500).json({ error: error.message });
        }
    };

    createDatabase = async (req: Request, res: Response) => {
        try {
            const { dbName } = req.body;
            const db = await this.databaseService.createDatabase(dbName);
            res.status(201).json({ message: `Database ${dbName} created`, dbName: db.databaseName });
        } catch (error) {
            console.error('Error creating MongoDB database:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    deleteDatabase = async (req: Request, res: Response) => {
        try {
            const { dbName } = req.params;
            await this.databaseService.deleteDatabase(dbName);
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting MongoDB database:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    createCollection = async (req: Request, res: Response) => {
        try {
            const { dbName, collectionName } = req.body;
            const collection = await this.databaseService.createCollection(dbName, collectionName);
            res.status(201).json({ message: `Collection ${collectionName} created`, collectionName: collection.collectionName });
        } catch (error) {
            console.error('Error creating MongoDB collection:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    deleteCollection = async (req: Request, res: Response) => {
        try {
            const { dbName, collectionName } = req.params;
            await this.databaseService.deleteCollection(dbName, collectionName);
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting MongoDB collection:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}