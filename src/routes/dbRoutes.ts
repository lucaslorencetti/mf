import { Router } from 'express';

import { resetDatabase } from '../controllers/dbController';

const router = Router();

router.post('/reset', resetDatabase); // Apenas criado para facilitar reset do db

export default router;
