import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface payment_info {
  courseID: string;
  paymentID: string;
  paymentTime: string;
  paymentDate: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  password: string;
  refreshToken: string;
  comparePassword: (password: string) => Promise<boolean>;
  generateAccesToken: () => string;
  generateRefreashToken: () => string;
}

const userModel: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "First name is required"],
      minLenght: [3, "Name should be atleast 3 character long"],
    },
    email: {
      type: String,
      unique: true,
      require: [true, "Email is required"],
    },
    password: {
      type: String,
      select: false,
    },
    refreshToken: {
      type: String,
      default: "0",
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      emum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

userModel.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userModel.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  let match = await bcrypt.compare(password, this.password);
  return match;
};

userModel.methods.generateAccesToken = function () {
  const token: string = process.env.ACCESS_TOKEN_SECRET || "";
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    token,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userModel.methods.generateRefreashToken = function () {
  const token: string = process.env.REFRESH_TOKEN_SECRET || "";
  return jwt.sign(
    {
      _id: this._id,
    },
    token,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

const User: Model<IUser> = mongoose.model("user", userModel);

export default User;
