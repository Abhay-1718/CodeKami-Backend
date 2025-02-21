import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();

const connectDb = async () => {
    try {
    
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected successfully.");
    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1);  
    }

    mongoose.connection.on('connected', () => {
        console.log("MongoDB connected.");
    });

    mongoose.connection.on('error', (error) => {
        console.error("MongoDB connection error:", error);
    });
}

export default connectDb;
