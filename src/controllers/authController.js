import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { ApiError } from '../middleware/errorHandler.js';

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  currentPlan: user.currentPlan ? { id: user.currentPlan._id, name: user.currentPlan.name, tier: user.currentPlan.tier } : null
});

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      throw new ApiError(409, 'An account with this email already exists');
    }

    const isFirstUser = (await User.countDocuments()) === 0;
    const user = await User.create({
      name,
      email,
      password,
      role: isFirstUser ? 'admin' : 'customer'
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: { user: publicUser(user), token: signToken(user) }
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password').populate('currentPlan');
    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(401, 'Invalid email or password');
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user: publicUser(user), token: signToken(user) }
    });
  } catch (err) {
    next(err);
  }
};
