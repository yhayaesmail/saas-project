import { Router } from 'express';
import { getProfile, getDashboard, getPremiumContent } from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';
import { attachSubscription } from '../middleware/attachSubscription.js';
import { requireMinTier } from '../middleware/tierGuard.js';

const router = Router();

router.use(verifyToken, attachSubscription);

router.get('/profile', getProfile);
router.get('/dashboard', getDashboard);
router.get('/premium-content', requireMinTier('premium'), getPremiumContent);

export default router;
