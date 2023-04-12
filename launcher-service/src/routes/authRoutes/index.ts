import { Router } from 'express';
import { createNonce, login, renewToken } from '../../controllers';

const router = Router();

router.post('/nonce', createNonce);
router.post('/renewToken', renewToken);
router.post('/login', login);

export default router;
