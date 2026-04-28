import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController';
import { requireAuth } from '@clerk/express';

router.post('/sync', requireAuth(), userController.syncUser);

export default router;