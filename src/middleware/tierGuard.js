import Plan from '../models/Plan.js';
import { ApiError } from './errorHandler.js';

export const requireMinTier = (minTier) => (req, res, next) => {
  if (!req.plan) {
    return next(new ApiError(402, `This content requires a paid subscription. Please upgrade your plan.`));
  }
  const currentRank = Plan.tierRank(req.plan.tier);
  const requiredRank = Plan.tierRank(minTier);
  if (currentRank < requiredRank) {
    return next(
      new ApiError(403, `This content requires a ${minTier} plan or higher. Your current plan is ${req.plan.name}.`)
    );
  }
  next();
};

export const requirePaidPlan = (req, res, next) => {
  if (!req.plan || req.plan.price <= 0) {
    return next(new ApiError(402, 'Full access requires a paid subscription. Please upgrade your plan.'));
  }
  next();
};
