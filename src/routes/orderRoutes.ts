import { Router } from 'express';
import { getOrders, getOrderById } from '../controllers/orderController';

const router = Router();

// GET /orders - Get all orders (paginated to 50)
router.get('/', getOrders);

// GET /orders/:id - Get a specific order by ID
router.get('/:id', getOrderById);

export default router;
