import * as dotenv from 'dotenv';

const isProduction = process.env.NODE_ENV === 'production';

// Load environment variables based on environment
if (isProduction) {
    dotenv.config({ path: '.env.production' }); // Load .env.production
    console.log('Running in production mode.');
} else {
    dotenv.config({ path: '.env.local' }); // Load .env.local
    console.log('Running in development mode.');
}