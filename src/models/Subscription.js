import mongoose from 'mongoose';

export const SUBSCRIPTION_STATUSES = ['active', 'cancelled', 'expired'];

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      required: true
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: SUBSCRIPTION_STATUSES,
      default: 'active'
    }
  },
  { timestamps: true }
);

subscriptionSchema.index({ user: 1, status: 1 });

export default mongoose.model('Subscription', subscriptionSchema);
