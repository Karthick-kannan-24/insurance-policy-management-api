import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDatabase = async () => {
  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      minPoolSize: 2,
    });

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
  console.log("MongoDB disconnected");
};