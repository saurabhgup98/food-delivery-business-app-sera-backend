import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Test CORS - Simple GET endpoint
router.get('/cors', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CORS test successful - Backend is accessible from frontend',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin || 'No origin header',
    method: req.method,
    headers: {
      'user-agent': req.headers['user-agent'],
      'origin': req.headers.origin
    }
  });
});

// Test CORS - POST endpoint
router.post('/cors', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CORS POST test successful',
    timestamp: new Date().toISOString(),
    receivedData: req.body,
    origin: req.headers.origin || 'No origin header'
  });
});

// Test MongoDB connection
router.get('/db-connection', async (req, res) => {
  try {
    const connectionState = mongoose.connection.readyState;
    const connectionStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    const dbStatus = {
      status: connectionStates[connectionState as keyof typeof connectionStates],
      readyState: connectionState,
      host: mongoose.connection.host || 'Not connected',
      port: mongoose.connection.port || 'Not connected',
      name: mongoose.connection.name || 'Not connected'
    };

    res.status(200).json({
      success: true,
      message: 'Database connection test completed',
      database: dbStatus,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Database connection test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
