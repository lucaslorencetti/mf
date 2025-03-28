import { Router } from 'express';
import orderRoutes from './orderRoutes';
import productRoutes from './productRoutes';
import dbRoutes from './dbRoutes';

const router = Router();

// Register all routes
router.use('/orders', orderRoutes);
router.use('/products', productRoutes);
router.use('/db', dbRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
