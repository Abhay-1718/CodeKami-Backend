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

const corsOptions = {
    origin: (origin, callback) => {
        if (origin === 'http://localhost:5173' || origin === 'https://codekami.online') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,  // Allow cookies and credentials to be sent
};



app.use(cors(corsOptions));  // Use the CORS middleware
app.use(cookieParser());
app.use(express.json());  // Parse incoming JSON requests

app.use('/auth', authRouter)  // Change '/api/auth' to '/auth'
app.use('/user', userRouter)  // Change '/api/user' to '/user'



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
        console.log('Server is running on http://localhost:5000');
    } catch (error) {
        console.error('Failed to start the server due to database connection issues:', error);
    }
});

export default app;
