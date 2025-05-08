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

// Add a new route for the root endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from karir.ai backend services!');
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
