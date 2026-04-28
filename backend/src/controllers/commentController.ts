import type { Request, Response } from 'express';
import * as queries from '../db/queries';
import { getAuth } from "@clerk/express";

export async function createComment(req: Request<{ productId: string }>, res: Response) {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const { productId } = req.params;
        const { content } = req.body;
        if (!content) return res.status(400).json({ error: 'Content is required' });

        const product = await queries.getProductById(productId);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        const newComment = await queries.createComment({ content, productId, userId });
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Failed to create comment' });
    }
}

export async function deleteComment(req: Request<{ commentId: string }>, res: Response) {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const { commentId } = req.params;
        const comment = await queries.getCommentById(commentId);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });
        if (comment.userId !== userId) return res.status(403).json({ error: 'Forbidden' });

        await queries.deleteComment(commentId);
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Failed to delete comment' });
    }
}