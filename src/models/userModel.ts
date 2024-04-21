import { Schema, Document, Model, model } from "mongoose";
import bcrypt from "bcryptjs"; // Make sure you have installed @types/bcryptjs
import { NextFunction } from "express";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Define a pre-save hook to hash the password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    if (error == null) {
      return;
    }
    console.log(error);
    /* Doute */
    // next(error); // Ensure next parameter is of type NextFunction
  }
});

// Define a method to compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    return false;
  }
};

const User: Model<IUser> = model<IUser>("User", userSchema);

export default User;
