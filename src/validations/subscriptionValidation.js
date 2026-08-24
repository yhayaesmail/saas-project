import Joi from 'joi';

const planRefSchema = Joi.alternatives().try(
  Joi.string().hex().length(24),
  Joi.string().trim().lowercase().valid('free', 'basic', 'premium')
).required().messages({
  'any.only': 'Plan must be one of: free, basic, premium',
  'any.required': 'Plan is required'
});

export const subscribeSchema = Joi.object({
  plan: planRefSchema
});

export const changePlanSchema = Joi.object({
  plan: planRefSchema
});

export const planCreateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(30).required(),
  tier: Joi.string().valid('free', 'basic', 'premium').required(),
  price: Joi.number().precision(2).min(0).required(),
  features: Joi.array().items(Joi.string().trim()).min(1).required(),
  durationDays: Joi.number().integer().min(1).default(30)
});

export const planUpdateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(30),
  price: Joi.number().precision(2).min(0),
  features: Joi.array().items(Joi.string().trim()).min(1),
  durationDays: Joi.number().integer().min(1),
  isActive: Joi.boolean()
}).min(1);
