import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import aiRoutes from './routes/ai.routes.js';  
import connectDb from './config/mongodb.js';
import authRouter from './routes/authRoute.js';
import userRouter from './routes/userRoutes.js';

const app = express();  

const port = process.env.PORT || 4000;

// CORS configuration
const corsOptions = {
    origin: process.env.ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
};

app.use(cors(corsOptions));  // Use the CORS middleware
app.use(cookieParser());
app.use(express.json());  // Parse incoming JSON requests

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)


// Use AI routes
app.use('/ai', aiRoutes);

// Simple root route for testing
app.get('/', (req, res) => {
    res.send('API is working');
});

// Start the server and connect to the database
app.listen(port, async () => {
    try {
        await connectDb();  // Connect to MongoDB
        console.log('Server is running on http://localhost:3000');
    } catch (error) {
        console.error('Failed to start the server due to database connection issues:', error);
    }
});

export default app;
