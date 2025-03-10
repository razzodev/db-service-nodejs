import { Router } from "express";
import mongoDbRoutes from './mongodb/users.routes';
import d1Routes from './d1/users.routes';

const router = Router();

router.use('/d1', d1Routes);
router.use('/mongodb', mongoDbRoutes);

export default router