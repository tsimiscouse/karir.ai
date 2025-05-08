import express, { Express, Request, Response, NextFunction } from 'express';
import userInputRoutes from './routes/userInputRoutes';
import morgan from 'morgan';
import cors from 'cors'; 

const app: Express = express();

app.use(morgan('dev'));

// Allow CORS from any origin
app.use(cors());

// Body parser
app.use(express.json());

// Routes
app.use('/api', userInputRoutes);
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from karir.ai backend services!');
});
app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
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

export default app;
