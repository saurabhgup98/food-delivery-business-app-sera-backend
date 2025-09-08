import express from 'express';
import mongoose from 'mongoose';
import Activity from '../models/Activity';

const router = express.Router();

// Check database connection
const checkDatabaseConnection = () => {
  return mongoose.connection.readyState === 1;
};

// Get activities for admin
router.get('/admin', async (req, res) => {
  try {
    // Check database connection
    if (!checkDatabaseConnection()) {
      return res.status(503).json({
        success: false,
        message: 'Database connection not available',
        data: { activities: [], pagination: { total: 0, page: 1, limit: 20, pages: 0 } }
      });
    }

    const { limit = 20, page = 1 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const activities = await Activity.find({ targetRole: 'admin' })
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .skip(skip)
      .populate('userId', 'name email')
      .populate('restaurantId', 'name location');

    const total = await Activity.countDocuments({ targetRole: 'admin' });

    return res.status(200).json({
      success: true,
      message: 'Admin activities retrieved successfully',
      data: {
        activities,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching admin activities:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin activities',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get activities for restaurant owner
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { limit = 20, page = 1 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const activities = await Activity.find({ 
      targetRole: 'restaurant_owner',
      restaurantId: restaurantId
    })
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .skip(skip)
      .populate('userId', 'name email')
      .populate('restaurantId', 'name location');

    const total = await Activity.countDocuments({ 
      targetRole: 'restaurant_owner',
      restaurantId: restaurantId
    });

    res.status(200).json({
      success: true,
      message: 'Restaurant activities retrieved successfully',
      data: {
        activities,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching restaurant activities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurant activities',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create new activity (for internal use)
router.post('/', async (req, res) => {
  try {
    const { type, title, description, userId, restaurantId, targetRole, metadata } = req.body;

    if (!type || !title || !description || !targetRole) {
      return res.status(400).json({
        success: false,
        message: 'Type, title, description, and targetRole are required'
      });
    }

    const activity = new Activity({
      type,
      title,
      description,
      userId,
      restaurantId,
      targetRole,
      metadata: metadata || {},
      timestamp: new Date()
    });

    await activity.save();

    return res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      data: { activityId: activity._id }
    });
  } catch (error) {
    console.error('Error creating activity:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create activity',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get activity statistics
router.get('/stats', async (req, res) => {
  try {
    const { targetRole, restaurantId } = req.query;
    
    let matchQuery: any = {};
    if (targetRole) matchQuery.targetRole = targetRole;
    if (restaurantId) matchQuery.restaurantId = restaurantId;

    const stats = await Activity.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          latest: { $max: '$timestamp' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      message: 'Activity statistics retrieved successfully',
      data: { stats }
    });
  } catch (error) {
    console.error('Error fetching activity statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
