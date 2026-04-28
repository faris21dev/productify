import { Request, Response } from "express";
import * as queries from '../db/queries';

import { getAuth } from "@clerk/express";
export async function getAllProducts(req: Request, res: Response) {
    try {
        const products = await queries.getAllProducts();
        res.status(200).json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getMyProducts(req: Request, res: Response) {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const products = await queries.getProductsByUserId(userId);
        res.status(200).json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Failed to get user products' });
    }
}

export async function getProductById(req: Request<{ id: string }>, res: Response) {
    try {
        const {id} = req.params;
        const product = await queries.getProductById(id);

        if (!product) return res.status(404).json({ error: 'Product not found' });

        res.status(200).json(product);
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
}

export async function createProduct(req: Request, res: Response) {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const {title, description, imageUrl} = req.body;
        if (!title || !description || !imageUrl) return res.status(400).json({error: 'Missing required fields'});

        const newProduct = await queries.createProduct({title, description, imageUrl, userId});
        res.status(201).json(newProduct);
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ error: 'Failed to create product' });
    }
}

export async function updateProduct(req: Request<{ id: string }>, res: Response) {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const {id} = req.params;
        const {title, description, imageUrl} = req.body;

        const existingProduct = await queries.getProductById(id);
        if (!existingProduct) return res.status(404).json({ error: 'Product not found' });
        if (existingProduct.userId !== userId) return res.status(403).json({ error: 'Forbidden, you are not the owner of this product' });

        const updatedProduct = await queries.updateProduct(id, {title, description, imageUrl});
        res.status(200).json(updatedProduct);
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ error: 'Failed to update product' });
    }
}

export async function deleteProduct(req: Request<{ id: string }>, res: Response) {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const {id} = req.params;

        const existingProduct = await queries.getProductById(id);
        if (!existingProduct) return res.status(404).json({ error: 'Product not found' });
        if (existingProduct.userId !== userId) return res.status(403).json({ error: 'Forbidden, you are not the owner of this product' });

        await queries.deleteProduct(id);
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: 'Failed to delete product' });
    }
}