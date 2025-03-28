import { Router } from 'express';
import {
  getProducts,
  getProductById,
  updateProductsFromFileHandler,
} from '../controllers/productController';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/update-from-file', updateProductsFromFileHandler);

export default router;
