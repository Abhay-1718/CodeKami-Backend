import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import aiRoutes from './routes/ai.routes.js';  
import connectDb from './config/mongodb.js';

const app = express();  

dotenv.config(); // Load environment variables from .env file

// CORS configuration
const corsOptions = {
    origin: process.env.ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
};

app.use(cors(corsOptions));  // Use the CORS middleware

app.use(express.json());  // Parse incoming JSON requests

// Use AI routes
app.use('/ai', aiRoutes);

// Simple root route for testing
app.get('/', (req, res) => {
    res.send('API is working');
});

// Start the server and connect to the database
app.listen(3000, async () => {
    try {
        await connectDb();  // Connect to MongoDB
        console.log('Server is running on http://localhost:3000');
    } catch (error) {
        console.error('Failed to start the server due to database connection issues:', error);
    }
});

export default app;
