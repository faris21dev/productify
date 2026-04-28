import express from 'express';
const router = express.Router();
import * as productController from '../controllers/productController';
import { requireAuth } from '@clerk/express';

router.get('/', requireAuth(), productController.getAllProducts);

router.get('/my', requireAuth(), productController.getMyProducts);

router.get('/:id', productController.getProductById);

router.post('/', requireAuth(), productController.createProduct);

router.put('/:id', requireAuth(), productController.updateProduct);

router.delete('/:id', requireAuth(), productController.deleteProduct);

export default router;