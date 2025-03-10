import config from './config';
config.loadEnvs();

import express, { Request, Response } from 'express';
import { mongodb, d1 } from './features/db';
import usersRoutes from './features/users/users.routes';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

async function startServer() {
    try {
        app.use('/users', usersRoutes);

        app.get('/', async (req: Request, res: Response) => {
            res.json('Hello, World!');
        })

        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });

        process.on('SIGINT', async () => {
            console.log('Closing mongodbDB connection...');
            await mongodb.closeDatabaseConnection();
            process.exit();
        });

    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

startServer()