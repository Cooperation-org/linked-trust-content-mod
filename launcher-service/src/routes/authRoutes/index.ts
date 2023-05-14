import { Router } from 'express';
import { createNonce, login, renewToken } from '../../controllers';
import { verifyJWTAndReturnfromPrisma } from '../../middleware';
const router = Router();

router.post('/nonce', createNonce);
router.post('/renewToken', renewToken);
router.post('/login', login);
router.get('/verifyJWTAndReturnfromPrisma', verifyJWTAndReturnfromPrisma);
export default router;
