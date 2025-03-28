import { Router } from 'express';
import orderRoutes from './orderRoutes';
import productRoutes from './productRoutes';
import dbRoutes from './dbRoutes';
import mockRoutes from './mockRoutes';

const router = Router();

router.use('/orders', orderRoutes);
router.use('/products', productRoutes);
router.use('/db', dbRoutes);
router.use('/mock', mockRoutes); // Apenas criado essa rota para facilitar a execução do script

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
