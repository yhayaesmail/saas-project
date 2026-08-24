import Plan, { PLAN_TIERS } from '../models/Plan.js';
import Subscription from '../models/Subscription.js';
import User from '../models/User.js';
import { ApiError } from '../middleware/errorHandler.js';

const resolvePlan = async (planRef) => {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(planRef);
  const query = isObjectId ? { _id: planRef } : { name: new RegExp(`^${planRef}$`, 'i') };
  const plan = await Plan.findOne({ ...query, isActive: true });
  if (!plan) {
    throw new ApiError(404, 'Plan not found or inactive');
  }
  return plan;
};

const populateSubscription = async (id) =>
  Subscription.findById(id).populate('plan', 'name tier price features durationDays');

const getActiveSubscription = async (userId) => {
  let sub = await Subscription.findOne({ user: userId, status: 'active' }).populate('plan');
  if (sub && sub.endDate < new Date()) {
    sub.status = 'expired';
    await sub.save();
    await User.findByIdAndUpdate(userId, { currentPlan: null });
    sub = null;
  }
  return sub;
};

export const subscribe = async (userId, planRef) => {
  const existing = await getActiveSubscription(userId);
  if (existing) {
    throw new ApiError(409, `You already have an active ${existing.plan.name} subscription. Use upgrade instead.`);
  }

  const plan = await resolvePlan(planRef);
  const endDate = new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000);

  const subscription = await Subscription.create({
    user: userId,
    plan: plan._id,
    startDate: new Date(),
    endDate,
    status: 'active'
  });

  await User.findByIdAndUpdate(userId, { currentPlan: plan._id });

  return populateSubscription(subscription._id);
};

export const changePlan = async (userId, planRef, direction) => {
  const current = await getActiveSubscription(userId);
  if (!current) {
    throw new ApiError(400, `No active subscription to ${direction}. Please subscribe first.`);
  }

  const newPlan = await resolvePlan(planRef);
  const currentRank = Plan.tierRank(current.plan.tier);
  const newRank = Plan.tierRank(newPlan.tier);

  if (newPlan._id.equals(current.plan._id)) {
    throw new ApiError(400, `You are already on the ${newPlan.name} plan`);
  }
  if (direction === 'upgrade' && newRank <= currentRank) {
    throw new ApiError(400, `${newPlan.name} is not a higher tier than your current ${current.plan.name} plan`);
  }
  if (direction === 'downgrade' && newRank >= currentRank) {
    throw new ApiError(400, `${newPlan.name} is not a lower tier than your current ${current.plan.name} plan`);
  }

  current.status = 'cancelled';
  await current.save();

  const endDate = new Date(Date.now() + newPlan.durationDays * 24 * 60 * 60 * 1000);
  const subscription = await Subscription.create({
    user: userId,
    plan: newPlan._id,
    startDate: new Date(),
    endDate,
    status: 'active'
  });

  await User.findByIdAndUpdate(userId, { currentPlan: newPlan._id });

  return populateSubscription(subscription._id);
};

export const cancelSubscription = async (userId) => {
  const current = await getActiveSubscription(userId);
  if (!current) {
    throw new ApiError(400, 'You have no active subscription');
  }

  current.status = 'cancelled';
  await current.save();
  await User.findByIdAndUpdate(userId, { currentPlan: null });

  return current;
};

export const getCurrentSubscription = async (userId) => {
  const current = await getActiveSubscription(userId);
  if (!current) {
    return null;
  }
  const daysLeft = Math.max(Math.ceil((current.endDate - Date.now()) / (1000 * 60 * 60 * 24)), 0);
  return { ...current.toObject(), daysRemaining: daysLeft };
};

export const getAllPlans = async () => {
  return Plan.find({ isActive: true }).sort({ price: 1 });
};

export const seedPlans = async () => {
  const defaults = [
    {
      name: 'Free',
      tier: 'free',
      price: 0,
      features: ['Basic access', '3 projects max', 'Community support'],
      durationDays: 365
    },
    {
      name: 'Basic',
      tier: 'basic',
      price: 9.99,
      features: ['Full standard access', 'Unlimited projects', 'Email support', '10 GB storage'],
      durationDays: 30
    },
    {
      name: 'Premium',
      tier: 'premium',
      price: 29.99,
      features: ['Everything in Basic', 'Premium content & analytics', 'Priority support', '100 GB storage', 'API access'],
      durationDays: 30
    }
  ];

  for (const p of defaults) {
    await Plan.updateOne({ name: p.name }, { $setOnInsert: p }, { upsert: true });
  }
  console.log('Default plans seeded (Free / Basic / Premium)');
};
