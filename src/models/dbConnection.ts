import mongoose from "mongoose";

const mongodbUri : string = process.env.MONGODB_URL || "";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(mongodbUri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDB;
