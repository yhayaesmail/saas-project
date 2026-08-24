import Subscription from '../models/Subscription.js';

export const attachSubscription = async (req, res, next) => {
  try {
    let sub = await Subscription.findOne({ user: req.user._id, status: 'active' }).populate('plan');

    if (sub && sub.endDate < new Date()) {
      sub.status = 'expired';
      await sub.save();
      req.user.currentPlan = null;
      await req.user.save();
      sub = null;
    }

    req.subscription = sub || null;
    req.plan = sub ? sub.plan : null;
    next();
  } catch (err) {
    next(err);
  }
};
