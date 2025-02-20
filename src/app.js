import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import connectDb from './config/mongodb.js';
import authRouter from './routes/authRoute.js';
import userRouter from './routes/userRoutes.js';
import aiRoutes from './routes/ai.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('API is working');
});

app.use((req, res, next) => {
  res.json({ error: 'Route not found' });
});

app.listen(port, async () => {
  try {
    await connectDb();
    console.log(`Server is running on http://localhost:${port}`);
  } catch (error) {
    console.error('Failed to start the server due to database connection issues:', error);
  }
});

export default app;
