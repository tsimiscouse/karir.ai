import express, { Express, Request, Response, NextFunction } from 'express';
import userInputRoutes from './routes/userInputRoutes';
import morgan from 'morgan';

const app: Express = express();

app.use(morgan('dev'));

app.use(express.json());

// Routes
app.use('/api', userInputRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;