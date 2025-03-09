import './config';
import express, { Request, Response } from 'express';
import serverless from 'serverless-http';
import { mongodb } from './features/db';
import usersRoutes from './features/users/users.routes';
import { VercelRequest } from '@vercel/node';

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());

async function startServer() {
    try {
        // await mongodb.connectToDatabase('app');
        // app.use('/users', usersRoutes);
        app.get('/', (req: Request, res: Response) => {
            res.json('Hello, World!');
        })
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });

        // process.on('SIGINT', async () => {
        //     console.log('Closing mongodbDB connection...');
        //     await mongodb.closeDatabaseConnection();
        //     process.exit();
        // });

    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

startServer()


const handler = serverless(app);

export default async function (event: VercelRequest, context: any) {
    return handler(event, context);
}