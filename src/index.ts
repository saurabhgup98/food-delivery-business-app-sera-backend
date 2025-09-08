import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const app = express();

// CORS middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://food-delivery-business-app-sera.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Basic middleware
app.use(express.json());

// Simple test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Hello from Vercel!' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.5',
    cors: 'enabled',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Simple activities endpoint (without database for now)
app.get('/api/activities/admin', (req, res) => {
  res.json({
    success: true,
    message: 'Admin activities retrieved successfully',
    data: {
      activities: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 20,
        pages: 0
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

export default app;