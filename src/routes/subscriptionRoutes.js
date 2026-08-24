import { Router } from 'express';
import {
  getPlans,
  subscribe,
  upgradePlan,
  downgradePlan,
  cancelSubscription,
  getCurrentSubscription
} from '../controllers/subscriptionController.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { validate } from '../middleware/validate.js';
import { subscribeSchema, changePlanSchema } from '../validations/subscriptionValidation.js';

const router = Router();

router.get('/plans', getPlans);

router.use(verifyToken);

router.post('/subscribe', requireRole('customer'), validate({ body: subscribeSchema }), subscribe);
router.put('/upgrade-plan', requireRole('customer'), validate({ body: changePlanSchema }), upgradePlan);
router.put('/downgrade-plan', requireRole('customer'), validate({ body: changePlanSchema }), downgradePlan);
router.post('/cancel-subscription', requireRole('customer'), cancelSubscription);
router.get('/subscription/me', getCurrentSubscription);

export default router;
