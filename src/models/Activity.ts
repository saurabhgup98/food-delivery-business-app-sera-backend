import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  type: string;
  title: string;
  description: string;
  userId?: mongoose.Types.ObjectId;
  restaurantId?: mongoose.Types.ObjectId;
  targetRole: 'admin' | 'restaurant_owner';
  metadata: Record<string, any>;
  timestamp: Date;
}

const activitySchema = new Schema<IActivity>({
  type: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: false
  },
  targetRole: {
    type: String,
    enum: ['admin', 'restaurant_owner'],
    required: true
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
activitySchema.index({ targetRole: 1, timestamp: -1 });
activitySchema.index({ restaurantId: 1, targetRole: 1, timestamp: -1 });
activitySchema.index({ userId: 1, timestamp: -1 });

const Activity = mongoose.model<IActivity>('Activity', activitySchema);

export default Activity;
