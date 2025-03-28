import { Router } from 'express';
import { resetDatabase } from '../controllers/dbController';

const router = Router();

router.post('/reset', resetDatabase);

export default router;
