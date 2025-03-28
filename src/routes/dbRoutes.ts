import { Router } from 'express';
import { resetDatabase } from '../controllers/dbController';

const router = Router();

// POST /db/reset - Reset the database (clear all tables)
router.post('/reset', resetDatabase);

export default router;
