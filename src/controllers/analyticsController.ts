import catchAsyncError from "../middlewares/catchAsyncError";
import { NextFunction, Request, Response } from "express";
import Service from "../models/serviceModel";
import Article from "../models/articalModel";
import Event from "../models/eventModel";
import { redis } from "../models/redis";
import User from "../models/userModel";


export const dataCount = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const countData = await redis.get("count");
    if (!countData) {
      const serviceCount = await Service.countDocuments().exec();
      const articalCount = await Article.countDocuments().exec();
      const eventsCounts = await Event.countDocuments().exec();
      const userCounts = await User.countDocuments().exec();
      const count = {
        serviceCount: serviceCount,
        articalCount: articalCount,
        eventsCounts: eventsCounts,
        userCounts:userCounts,
      };

      await redis.set("count", JSON.stringify(count));
      res.status(200).json({
        success:true,
        count
      })
    } else{
        const count = await JSON.parse(countData)

        res.status(200).json({
            success:true,
            count
        })
    }
  }
);
