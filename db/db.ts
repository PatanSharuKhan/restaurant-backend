import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

export const connectDB = async () => {
    try {
        mongoose.connect(process.env.RESTAURANT_DATABASE_URL || '').then(() => {
            console.log("Connected to MongoDB");
        }).catch((err: Error) => {
            console.log("Error connecting to MongoDB", err);
        });
    } catch (err) {
        console.error("MongoDB connection error:", err)
    }
}

export const disconnectDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('Database Disconnected')
    } catch (err) {
        console.error("Error disconnecting MongoDB:", err)
    }
}
