import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {};

export async function dbConnect() {
    if (connection.isConnected) {
        console.log("MongoDB is already connected");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI as string);
        connection.isConnected = db.connections[0].readyState;
        console.log("MongoDB connected:", connection.isConnected);
    } catch (error) {
        console.log("MongoDB connection error:", error);
        process.exit(1);
    }
}