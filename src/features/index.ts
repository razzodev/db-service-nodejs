import { MongoUsersService, MongoUsersController, setupMongoRoutes } from './users/mongodb'
import { D1UsersService, D1UsersController, setupD1Routes, d1 } from './users/d1'
import { mongodb } from './db';

async function initializeFeatures() {
    await mongodb.connectToDatabase(process.env.MONGO_DB_NAME || '');
    const mongoDb = mongodb.getDb();
    const mongoUsersService = new MongoUsersService(mongoDb);
    const mongoUsersController = new MongoUsersController(mongoUsersService);
    const mongoUserRoutes = setupMongoRoutes(mongoUsersController);

    const d1UsersService = new D1UsersService(d1);
    const d1UsersController = new D1UsersController(d1UsersService);
    const d1UserRoutes = setupD1Routes(d1UsersController);

    return {
        mongoUserRoutes,
        d1UserRoutes
    }
}

export { initializeFeatures };

