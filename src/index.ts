import express from 'express';

const app = express();

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
    timestamp: new Date().toISOString() 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

export default app;