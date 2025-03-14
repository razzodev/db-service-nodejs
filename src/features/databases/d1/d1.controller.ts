

// src/features/databases/d1/databases.controller.ts
import { Request, Response } from 'express';
import { D1DatabaseService } from './d1.service';
import fs from 'fs/promises';
import path from 'path';
import { isSqlValid } from '../../../commons/middleware';
export class D1DatabaseController {
    constructor(private databaseService: D1DatabaseService) { }

    query = async (req: Request, res: Response): Promise<void> => {
        try {
            const { sql, params } = req.body;
            if (!isSqlValid(sql)) {
                res.status(400).json({ error: 'SQL syntax error' });
                return
            }
            const result = await this.databaseService.query(sql, params || []);
            res.status(200).json(result);
        } catch (error: any) {
            console.error('D1 query error:', error);
            res.status(400).json(error) // Pass error to next middleware
        }
    };

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
}

