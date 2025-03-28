import { Router } from 'express';

import { triggerMockProducer } from '../controllers/mockController';

const router = Router();

router.post('/produce', triggerMockProducer); // Apenas criado essa rota para facilitar a execução do script

export default router;
