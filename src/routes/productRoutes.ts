import { Router } from 'express';
import { getProducts, getProductById } from '../controllers/productController';

const router = Router();

// GET /products - Get all products
router.get('/', getProducts);

// GET /products/:id - Get a specific product by ID
router.get('/:id', getProductById);

export default router;
