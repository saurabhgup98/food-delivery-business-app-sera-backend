import express from 'express';

const router = express.Router();

// Get total revenue
router.get('/revenue', (req, res) => {
  try {
    // Generate random revenue between 25000 and 35000
    const minRevenue = 25000;
    const maxRevenue = 35000;
    const revenue = Math.floor(Math.random() * (maxRevenue - minRevenue + 1)) + minRevenue;
    
    // Calculate percentage change (random between -10% to +20%)
    const changePercentage = Math.floor(Math.random() * 31) - 10; // -10 to +20
    const changeType = changePercentage >= 0 ? 'positive' : 'negative';
    
    res.status(200).json({
      success: true,
      message: 'Revenue data retrieved successfully',
      data: {
        title: 'Total Revenue',
        value: `₹${revenue.toLocaleString()}`,
        change: `${changePercentage > 0 ? '+' : ''}${changePercentage}%`,
        changeType: changeType,
        icon: '💰',
        rawValue: revenue,
        currency: 'INR'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching revenue data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching revenue data',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Get dashboard metrics (all metrics)
router.get('/metrics', (req, res) => {
  try {
    // Generate random data for all metrics
    const revenue = Math.floor(Math.random() * 10000) + 25000;
    const orders = Math.floor(Math.random() * 50) + 120;
    const users = Math.floor(Math.random() * 500) + 2000;
    const restaurants = Math.floor(Math.random() * 20) + 80;

    const metrics = [
      {
        title: 'Total Revenue',
        value: `₹${revenue.toLocaleString()}`,
        change: `+${Math.floor(Math.random() * 20) + 5}%`,
        changeType: 'positive' as const,
        icon: '💰',
        rawValue: revenue
      },
      {
        title: 'Total Orders',
        value: orders.toString(),
        change: `+${Math.floor(Math.random() * 15) + 3}%`,
        changeType: 'positive' as const,
        icon: '📦',
        rawValue: orders
      },
      {
        title: 'Total Users',
        value: users.toLocaleString(),
        change: `+${Math.floor(Math.random() * 18) + 8}%`,
        changeType: 'positive' as const,
        icon: '👥',
        rawValue: users
      },
      {
        title: 'Restaurants',
        value: restaurants.toString(),
        change: `+${Math.floor(Math.random() * 10) + 2}%`,
        changeType: 'positive' as const,
        icon: '🏪',
        rawValue: restaurants
      }
    ];

    res.status(200).json({
      success: true,
      message: 'Dashboard metrics retrieved successfully',
      data: metrics,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard metrics',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
