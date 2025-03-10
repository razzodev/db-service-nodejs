

// src/features/databases/d1/databases.controller.ts
import { Request, Response } from 'express';
import { D1DatabaseService } from './databases.service';
import fs from 'fs/promises';
import path from 'path';

export class D1DatabaseController {
    constructor(private databaseService: D1DatabaseService) { }

    runMigration = async (req: Request, res: Response) => {
        try {
            const { migrationFileName } = req.body;
            const migrationFilePath = path.join(__dirname, 'migrations', migrationFileName);
            const migrationSql = await fs.readFile(migrationFilePath, 'utf-8');
            const result = await this.databaseService.runMigration(migrationSql);
            res.status(200).json({ message: `Migration ${migrationFileName} executed`, result });
        } catch (error) {
            console.error('Error running D1 migration:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    runAdvancedQuery = async (req: Request, res: Response) => {
        try {
            const { sql, params } = req.body;
            const result = await this.databaseService.runAdvancedQuery(sql, params);
            res.status(200).json({ result });
        } catch (error) {
            console.error('Error running D1 advanced query:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    // Other D1 database management controller methods...
}

