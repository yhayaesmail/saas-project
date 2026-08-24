import * as service from '../services/subscriptionService.js';

export const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        profile: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          currentPlan: req.plan ? { id: req.plan._id, name: req.plan.name, tier: req.plan.tier } : null,
          subscriptionActive: Boolean(req.subscription),
          memberSince: req.user.createdAt
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getDashboard = async (req, res, next) => {
  try {
    const isPaid = Boolean(req.plan && req.plan.price > 0);
    res.status(200).json({
      success: true,
      message: isPaid ? 'Welcome back' : 'Welcome — upgrade to a paid plan for full access',
      data: {
        user: { name: req.user.name },
        plan: req.plan ? { name: req.plan.name, tier: req.plan.tier, price: req.plan.price } : null,
        accessLevel: isPaid ? 'full' : 'limited',
        widgets: isPaid
          ? ['overview', 'usage-stats', 'team-members', 'integrations', 'reports']
          : ['overview'],
        upgradePrompt: isPaid
          ? null
          : 'You are on the Free plan. Subscribe to Basic or Premium to unlock the full dashboard.'
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getPremiumContent = async (req, res, next) => {
  try {
    const plans = await service.getAllPlans();
    res.status(200).json({
      success: true,
      message: 'Premium content unlocked',
      data: {
        content: [
          { title: 'Advanced Analytics', description: 'Deep insights with custom reports and export tools.' },
          { title: 'Priority API Access', description: 'Higher rate limits and dedicated endpoints.' },
          { title: 'Exclusive Resources', description: 'Templates, guides and premium integrations.' }
        ],
        yourPlan: { name: req.plan.name, tier: req.plan.tier },
        availablePlans: plans.map((p) => ({ name: p.name, price: p.price }))
      }
    });
  } catch (err) {
    next(err);
  }
};
