import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middlewares/catchAsyncError";
import Event from "../models/eventModel";
import cloudinary from "cloudinary";
import { redis } from "../models/redis";

cloudinary.v2.config({
  cloud_name: "ddunz9xtw",
  api_key: process.env.CLOUDINARY_PUBLIC_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Add Event
export const addEvent = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        title,
        description,
        location,
        date,
        organizer,
        tags,
        isVirtual,
        details,
      } = req.body;

      // Validate input
      if (
        !title ||
        !description ||
        !location ||
        !date ||
        !organizer ||
        !details ||
        !details.length
      ) {
        return res.status(400).json({
          message:
            "Please provide all required fields and at least one paragraph.",
        });
      }

      // Create a new event
      const newEvent = new Event({
        title,
        description,
        location,
        date,
        organizer,
        tags,
        isVirtual,
        details,
      });

      // Save the event to the database
      await newEvent.save();

      const events = await Event.find().exec();
      await redis.set("events", JSON.stringify(events));

      res
        .status(201)
        .json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
      console.error("Error adding event:", error);
      res
        .status(500)
        .json({ message: "An error occurred while adding the event." });
    }
  }
);

// Edit Event
export const editEvent = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        location,
        date,
        organizer,
        tags,
        isVirtual,
        attendees,
        details,
      } = req.body;
      console.log(req.body);

      // Update the event by ID
      const updatedEvent = await Event.findByIdAndUpdate(
        id,
        {
          title,
          description,
          location,
          date,
          organizer,
          tags,
          isVirtual,
          attendees,
          details,
        },
        { new: true, runValidators: true } // Returns the updated document and runs validation
      );

      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found." });
      }

      res
        .status(200)
        .json({ message: "Event updated successfully", event: updatedEvent });
    } catch (error) {
      console.error("Error updating event:", error);
      res
        .status(500)
        .json({ message: "An error occurred while updating the event." });
    }
  }
);

// Delet Events
export const deleteEvent = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      console.log(id)

      // Find the event by ID and delete it
      const deletedEvent = await Event.findByIdAndDelete(id);
      console.log(deleteEvent)

      if (!deletedEvent) {
        return res.status(404).json({ message: "Event not found." });
      }

      res.status(200).json({ message: "Event deleted successfully." });
    } catch (error) {
      console.error("Error deleting event:", error);
      res
        .status(500)
        .json({ message: "An error occurred while deleting the event." });
    }
  }
);

export const allEvent = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      const events = await Event.find().exec();
      res.status(200).json({
        message: "Event fatch events successfully.", 
        success:true,
        events });

    } catch (error) {
      console.error("Error deleting event:", error);
      res
        .status(500)
        .json({ message: "An error occurred while deleting the event." });
    }
  }
);
