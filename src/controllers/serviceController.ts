import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middlewares/catchAsyncError";
import Service from "../models/serviceModel";
// import { cloud } from "../middlewares/cloudinary";

import cloudinary from "cloudinary"

cloudinary.v2.config({
  cloud_name: "dcj2gzytt",
  api_key: process.env.CLOUDINARY_PUBLIC_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Add Services
export const addService = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    let { title, headline, image, tags, details } = req.body;
    console.log(req.body)

    // Validate input
    if (!title || !headline || !image || !image.url || !tags || !Array.isArray(tags) || tags.length === 0 || !details || !Array.isArray(details) || details.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    // Check details structure
    const isValidDetails = details.every((detail: { title?: string; paragraphs: string }) => {
      return typeof detail.paragraphs === "string" && detail.paragraphs.trim().length > 0;
    });

    if (!isValidDetails) {
      return res
        .status(400)
        .json({ message: "Each detail must include at least a 'paragraphs' field with text." });
    }

    if(image.url){
      const myCloud = await cloudinary.v2.uploader.upload(image?.url, {
        folder: "Services",
      });
      image = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url
      }
    }

    // Create a new service
    const newService = new Service({
      title,
      headline,
      image,
      tags,
      details,
    });

    // Save the service to the database
    await newService.save();

    res.status(201).json({
      message: "Service created successfully",
      service: newService,
    });
  }
);

// Edit Services
export const editService = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { title, headline, details } = req.body;

    // Validate input
    if (!title && !headline && !details) {
      return res
        .status(400)
        .json({ message: "Please provide at least one field to update." });
    }

    // Find the service by ID and update it
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { title, headline, details },
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found." });
    }

    res.status(200).json({
      message: "Service updated successfully",
      service: updatedService,
    });
  }
);

// Delete Services
export const deleteService = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // Find the service by ID and delete it
    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ message: "Service not found." });
    }

    res.status(200).json({ message: "Service deleted successfully" });
  }
);
