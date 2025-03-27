import { Router } from 'express';
import orderRoutes from './orderRoutes';
import productRoutes from './productRoutes';

const router = Router();

// Register all routes
router.use('/orders', orderRoutes);
router.use('/products', productRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
