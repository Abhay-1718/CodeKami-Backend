import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import aiRoutes from './routes/ai.routes.js';  
import connectDb from './config/mongodb.js';
import authRouter from './routes/authRoute.js';
import userRouter from './routes/userRoutes.js';

dotenv.config();

const app = express();  

const port = process.env.PORT || 5000;

<<<<<<< HEAD
=======
const origin = process.env.NODE_ENV === "production" 
  ? "http://15.206.179.46" 
  : process.env.ORIGIN;

>>>>>>> a625d13579eb78577e92934f9c8ff4a8ebcbca38
const corsOptions = {
    origin: process.env.NODE_ENV === "production" 
        ? "http://15.206.179.46"  // Just the IP address
        : "http://localhost:5173", // Assuming Vite's default port
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));  // Use the CORS middleware
app.use(cookieParser());
app.use(express.json());  // Parse incoming JSON requests

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/ai', aiRoutes);

// Simple root route for testing
app.get('/', (req, res) => {
    res.send('API is working');
});

// Error handler for routes that do not exist
app.use((req, res, next) => {
    res.status(404).send({ error: 'Route not found' });
});

// Start the server and connect to the database
app.listen(port, async () => {
    try {
        await connectDb();  // Connect to MongoDB
        if (process.env.NODE_ENV !== 'production') {
            console.log('Server is running on http://localhost:5000');
        }
    } catch (error) {
        console.error('Failed to start the server due to database connection issues:', error);
    }
});

export default app;
