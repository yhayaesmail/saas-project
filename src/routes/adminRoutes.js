import { Router } from 'express';
import {
  createPlan,
  updatePlan,
  getAllUsers,
  getAllSubscriptions,
  reseedPlans
} from '../controllers/adminController.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { validate } from '../middleware/validate.js';
import { planCreateSchema, planUpdateSchema } from '../validations/subscriptionValidation.js';

const router = Router();

router.use(verifyToken, requireRole('admin'));

router.get('/users', getAllUsers);
router.get('/subscriptions', getAllSubscriptions);
router.post('/plans', validate({ body: planCreateSchema }), createPlan);
router.put('/plans/:planId', validate({ body: planUpdateSchema }), updatePlan);
router.post('/plans/seed', reseedPlans);

export default router;
