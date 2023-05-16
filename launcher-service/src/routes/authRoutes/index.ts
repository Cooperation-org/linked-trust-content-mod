import { Router } from 'express';
import { createNonce, login, renewToken } from '../../controllers';
import { jwtDBAuth } from '../../middleware';
const router = Router();

router.post('/nonce', createNonce);
router.post('/renewToken', renewToken);
router.post('/login', login);
router.get('/jwtDBAuth', jwtDBAuth);
export default router;
