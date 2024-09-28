import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/userModel";
import { setCookie } from "../utils/cookieUtils";

import catchAsyncError from "../middlewares/catchAsyncError";
import ErrorHandler from "../middlewares/ErrorHandler";
import errorHandler from "../utils/errorHandler";
import sendmail from "../utils/sendmail";
import { activationToken } from "../utils/activationToken";
import { redis } from "../models/redis";
import { generateTokens } from "../utils/generateTokens";


interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  contact?: number;
}

export const addUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // const requestBody: IRegistrationBody = req.body as IRegistrationBody ;
    console.log(req.body)
    const { name, email, password} = req.body as IRegistrationBody;

    if (!name || !email || !password)
      return next(new errorHandler(`fill all deatils`));

    const isEmailExit = await User.findOne({ email: email });
    if (isEmailExit)
      return next(
        new errorHandler("User With This Email Address Already Exits")
      );

    const ActivationCode = Math.floor(1000 + Math.random() * 9000);

    const newUser = await User.create({
      name,
      email,
      password,
      isVerified: true,
    });
    const userCount = await User.countDocuments().exec();
    let countString = await redis.get("count")
    if(countString){
      const count = await JSON.parse(countString);
      count.userCounts = userCount
      await redis.set("count",JSON.stringify(count));
    }

    res
      .status(201)
      .json({
        succcess: true,
        message: "successfully Add new user",
        user: newUser,
      });
  }
);

interface IloginReques {
  email: string;
  password: string;
}

export const userLogin = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as IloginReques;
    console.log(req.body)
    if (!email || !password)
      return next(new errorHandler("Pleas fill all details"));

    // const user: IUser | null = await User.findOne({ email: email }).populate("cou").select("+password -courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links")
    const user = await User.findOne({ email: email }).select("+password").exec();
    console.log(user)
    
    if (!user)
      return next(new errorHandler("User Not Found With this Email", 401));

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return next(new errorHandler("Wrong Credientials", 401));


    const tokens = generateTokens(user);

    user.refreshToken = tokens.refreshToken;
    await user.save();
    user.password = "";

    // await redis.set(user._id, JSON.stringify(user));

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .cookie("accessToken", tokens?.accessToken, {
        httpOnly: true,
        secure: true,
        maxAge:  24 * 60 * 60 * 1000,
        sameSite:"none"
      })
      .cookie("refreshToken", tokens?.refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge:  24 * 60 * 60 * 1000,
        sameSite:"none"
      })
      .json({
        succcess: true,
        message: "successfully login",
        user: user,
        accessToken: tokens?.accessToken,
        refreshToken: tokens?.accessToken,
      });
  }
);

export const currUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if(!user){
        next(new errorHandler("user not lonin",401))
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new errorHandler(error.message, 500));
    }
  }
);


export const userLongOut = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // const id = req.user?._id;
    const id = req.params.id;
    console.log(id)
    if(!id) return next(new errorHandler("login to user the resorse",404))
    await User.findByIdAndUpdate(id, {
      $set: {
        refreshToken: undefined,
      },
    });

    // await redis.del(id);
    const options = {
      httpOnly: true,
      secure: true,
    };
    res.clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        succcess: true,
        message: "successfully logout",
      });
  }
);


export const allUsers = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {

    const users = await User.find().exec();

    res.json({
        succcess: true,
        users: users
      });
  }
);


export const removeUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const user = await User.findById(id).exec();

    if(!user){
      return next(new errorHandler("User not found",404))
    }

    await User.findByIdAndDelete(id);
    
    res.json({
        succcess: true,
        message:"Revome user"
      });
  }
);

export const updateUserInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { name, email } = req.body;
      console.log(req.body)
  
      // Check if the user is authenticated
      const userId = req.user?._id;
      const user = await User.findByIdAndUpdate(userId,{name,email}, { new: true, runValidators: true })
      // let user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const tokens = generateTokens(user);

      user.refreshToken = tokens.refreshToken;
      await user.save();
      user.password = "";
  
      // await redis.set(user._id, JSON.stringify(user));
  
      const options = {
        httpOnly: true,
        secure: true,
      };
  
      res
        .status(200)
        .cookie("accessToken", tokens?.accessToken, {
          httpOnly: true,
          secure: true,
          maxAge:  24 * 60 * 60 * 1000,
          sameSite:"none"
        })
        .cookie("refreshToken", tokens?.refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge:  24 * 60 * 60 * 1000,
          sameSite:"none"
        })
        .json({
          succcess: true,
          message: "successfully update the user",
          user: user,
          accessToken: tokens?.accessToken,
          refreshToken: tokens?.accessToken,
        });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);


export const updatePassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { currentPassword, newPassword } = req.body;
  
      // Check if the user is authenticated
      const userId = req.user?._id;
      const user = await User.findById(userId).select("+password");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if the current password is correct
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
  
      // Hash the new password and update the user document
      user.password = newPassword;
      await user.save();
  
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);
