import { d1 } from '../../../services/db'; // Your D1 wrapper

export class D1DatabaseService {
    constructor(private db: typeof d1) { }

    query = async (sql: string, params: string[] = []): Promise<any> => {
        return this.db.query(sql, params);
    }

    runMigration = async (migrationSql: string): Promise<any> => {
        return this.db.query(migrationSql);
    }
}