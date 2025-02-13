import mongoose from 'mongoose';

const connectDb = async () => {
    try {
        // Establish the connection to MongoDB
        await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log("Database connected successfully.");
    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1);  // Exit the process if the database connection fails
    }

    mongoose.connection.on('connected', () => {
        console.log("MongoDB connected.");
    });

    mongoose.connection.on('error', (error) => {
        console.error("MongoDB connection error:", error);
    });
}

export default connectDb;
