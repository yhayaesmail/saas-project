import Plan from '../models/Plan.js';
import Subscription from '../models/Subscription.js';
import User from '../models/User.js';
import { ApiError } from '../middleware/errorHandler.js';
import { seedPlans } from '../services/subscriptionService.js';

export const createPlan = async (req, res, next) => {
  try {
    const plan = await Plan.create(req.body);
    res.status(201).json({ success: true, message: 'Plan created successfully', data: { plan } });
  } catch (err) {
    next(err);
  }
};

export const updatePlan = async (req, res, next) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.planId, req.body, { new: true, runValidators: true });
    if (!plan) throw new ApiError(404, 'Plan not found');
    res.status(200).json({ success: true, message: 'Plan updated successfully', data: { plan } });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 100);
    const [users, total] = await Promise.all([
      User.find().populate('currentPlan', 'name tier price').skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments()
    ]);
    res.status(200).json({
      success: true,
      data: { count: users.length, total, page, totalPages: Math.ceil(total / limit), users }
    });
  } catch (err) {
    next(err);
  }
};

export const getAllSubscriptions = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 100);
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [subscriptions, total] = await Promise.all([
      Subscription.find(filter)
        .populate('user', 'name email')
        .populate('plan', 'name tier price')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Subscription.countDocuments(filter)
    ]);
    res.status(200).json({
      success: true,
      data: { count: subscriptions.length, total, page, totalPages: Math.ceil(total / limit), subscriptions }
    });
  } catch (err) {
    next(err);
  }
};

export const reseedPlans = async (req, res, next) => {
  try {
    await seedPlans();
    res.status(200).json({ success: true, message: 'Default plans seeded' });
  } catch (err) {
    next(err);
  }
};
