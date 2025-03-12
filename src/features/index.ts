import { MongoUsersService, MongoUsersController, setupMongoRoutes } from './users/mongodb'
import { D1UsersService, D1UsersController, setupD1Routes, d1 } from './users/d1'
import { MongoDatabaseService, MongoDatabaseController, setupMongoDatabasesRoutes } from './databases/mongodb'
import { D1DatabaseService, D1DatabaseController, setupD1DatabasesRoutes } from './databases/d1'
import { mongodb } from '../services/db';

async function initializeFeatures() {
    await mongodb.connectToDatabase(process.env.MONGO_DB_NAME || '');
    const mongoDb = mongodb.getDb();
    // const mongoUsersService = new MongoUsersService(mongoDb);
    // const mongoUsersController = new MongoUsersController(mongoUsersService);
    // const mongoUserRoutes = setupMongoRoutes(mongoUsersController);

    // const d1UsersService = new D1UsersService(d1);
    // const d1UsersController = new D1UsersController(d1UsersService);
    // const d1UserRoutes = setupD1Routes(d1UsersController);

    const mongoDatabasesService = new MongoDatabaseService(mongodb.client);
    const mongoDatabasesController = new MongoDatabaseController(mongoDatabasesService);
    const mongoDatabasesRoutes = setupMongoDatabasesRoutes(mongoDatabasesController);

    const d1DatabasesService = new D1DatabaseService(d1);
    const d1DatabasesController = new D1DatabaseController(d1DatabasesService);
    const d1DatabasesRoutes = setupD1DatabasesRoutes(d1DatabasesController);



    return {
        // mongoUserRoutes,
        // d1UserRoutes,
        mongoDatabasesRoutes,
        d1DatabasesRoutes
    }
}

export { initializeFeatures };

