import express, { Express, Request, Response, NextFunction } from 'express';
import userInputRoutes from './routes/userInputRoutes';
import morgan from 'morgan';
import cors from 'cors';

// Add startup logging
console.log('Application starting...');
console.log('Node version:', process.version);
console.log('Environment:', process.env.NODE_ENV);
console.log('PORT env variable:', process.env.PORT);

const app: Express = express();

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from karir.ai backend services!');
});

// Routes
app.use('/api', userInputRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error caught by middleware:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server - IMPORTANT: bind to 0.0.0.0
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;
console.log(`Attempting to bind to 0.0.0.0:${PORT}...`);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on host 0.0.0.0 and port ${PORT}`);
}).on('error', (err) => {
  console.error('Server failed to start with error:', err);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  server.close(() => {
    process.exit(1);
  });
});

export default app;