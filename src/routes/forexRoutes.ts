import { Router } from 'express';
import { getForexData } from '../controllers/forexController';

const router = Router();

router.get('/forex-data', getForexData);

export default router;
