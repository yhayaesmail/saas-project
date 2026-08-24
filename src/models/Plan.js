import mongoose from 'mongoose';

export const PLAN_TIERS = ['free', 'basic', 'premium'];

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    tier: {
      type: String,
      enum: PLAN_TIERS,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    features: [
      {
        type: String,
        trim: true
      }
    ],
    durationDays: {
      type: Number,
      default: 30,
      min: 1
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

planSchema.statics.tierRank = (tier) => ({ free: 0, basic: 1, premium: 2 }[tier] ?? -1);

export default mongoose.model('Plan', planSchema);
