import * as service from '../services/subscriptionService.js';

export const getPlans = async (req, res, next) => {
  try {
    const plans = await service.getAllPlans();
    res.status(200).json({ success: true, data: { count: plans.length, plans } });
  } catch (err) {
    next(err);
  }
};

export const subscribe = async (req, res, next) => {
  try {
    const subscription = await service.subscribe(req.user._id, req.body.plan);
    res.status(201).json({
      success: true,
      message: `Subscribed successfully`,
      data: { subscription }
    });
  } catch (err) {
    next(err);
  }
};

export const upgradePlan = async (req, res, next) => {
  try {
    const subscription = await service.changePlan(req.user._id, req.body.plan, 'upgrade');
    res.status(200).json({
      success: true,
      message: 'Plan upgraded successfully',
      data: { subscription }
    });
  } catch (err) {
    next(err);
  }
};

export const downgradePlan = async (req, res, next) => {
  try {
    const subscription = await service.changePlan(req.user._id, req.body.plan, 'downgrade');
    res.status(200).json({
      success: true,
      message: 'Plan downgraded successfully',
      data: { subscription }
    });
  } catch (err) {
    next(err);
  }
};

export const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await service.cancelSubscription(req.user._id);
    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: { subscription }
    });
  } catch (err) {
    next(err);
  }
};

export const getCurrentSubscription = async (req, res, next) => {
  try {
    const subscription = await service.getCurrentSubscription(req.user._id);
    if (!subscription) {
      return res.status(200).json({
        success: true,
        message: 'No active subscription',
        data: { subscription: null, currentPlan: req.user.currentPlan || null }
      });
    }
    res.status(200).json({ success: true, data: { subscription } });
  } catch (err) {
    next(err);
  }
};
