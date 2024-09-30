import { Router } from 'express';
import { fetchForexData } from '../controllers/forexController';

const router = Router();

router.get('/forex-data', fetchForexData);

export default router;
