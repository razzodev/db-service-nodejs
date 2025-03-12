import Cloudflare from 'cloudflare';
import config from '../../config';
import { QueryResultsSinglePage } from 'cloudflare/resources/d1/database';

const client = new Cloudflare({
    apiEmail: process.env.CF_API_EMAIL || '',
    apiKey: process.env.CF_API_KEY || '',
});

export function getD1Client() {
    return new Cloudflare({
        apiEmail: process.env.CF_API_EMAIL || '',
        apiKey: process.env.CF_API_KEY || '',
    });
}

const { cf } = config;

async function query(
    sql: string,
    params: string[] = [], // Allow more parameter types
    databaseId: string = cf.databaseId,
    accountId: string = cf.accountId
): Promise<QueryResultsSinglePage | undefined> {
    try {
        const response = await client.d1.database.query(databaseId, {
            account_id: accountId,
            sql: sql,
            params: params, // Correctly pass the params
        });

        return response;
    } catch (e) {
        console.error('Error querying D1:', e);
        throw e; // Rethrow the error for the service to handle
    }
}

export const d1 = {
    query,
};