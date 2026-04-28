import express from 'express';
const router = express.Router();
import * as commentController from '../controllers/commentController';
import { requireAuth } from '@clerk/express';

router.post('/:productId', requireAuth(), commentController.createComment);

router.delete('/:commentId', requireAuth(), commentController.deleteComment);

export default router;