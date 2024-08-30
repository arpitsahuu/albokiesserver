import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middlewares/catchAsyncError";
import Event from "../models/eventModel";

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
        attendees,
        paragraphs,
      } = req.body;

      // Validate input
      if (
        !title ||
        !description ||
        !location ||
        !date ||
        !organizer ||
        !paragraphs ||
        !paragraphs.length
      ) {
        return res
          .status(400)
          .json({
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
        attendees,
        paragraphs,
      });

      // Save the event to the database
      await newEvent.save();

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
        paragraphs,
      } = req.body;

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
          paragraphs,
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

      // Find the event by ID and delete it
      const deletedEvent = await Event.findByIdAndDelete(id);

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
