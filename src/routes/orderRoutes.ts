import { Router } from 'express';

import { getOrderById, getOrders } from '../controllers/orderController';

const router = Router();

router.get('/', getOrders);
router.get('/:id', getOrderById);

export default router;
