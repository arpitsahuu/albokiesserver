import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middlewares/catchAsyncError";
import Innovation from "../models/innovationModel";

// Add Innovation
export const addInnovation = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      title,
      description,
      author,
      dateOfCreation,
      tags,
      status,
      impact,
      paragraphs,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !author ||
      !dateOfCreation ||
      !impact ||
      !paragraphs ||
      paragraphs.length === 0
    ) {
      return res.status(400).json({
        message:
          "All required fields must be provided, including at least one paragraph.",
      });
    }

    // Create a new innovation
    const newInnovation = new Innovation({
      title,
      description,
      author,
      dateOfCreation,
      tags,
      status,
      impact,
      paragraphs,
    });

    // Save the innovation to the database
    await newInnovation.save();

    res.status(201).json({
      message: "Innovation created successfully",
      innovation: newInnovation,
    });
  }
);

// Edit Innovation
export const editInnovation = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updateData = req.body;

    // Validate input
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No data provided for update." });
    }

    // Find the innovation by ID and update it
    const updatedInnovation = await Innovation.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedInnovation) {
      return res.status(404).json({ message: "Innovation not found." });
    }

    res.status(200).json({
      message: "Innovation updated successfully",
      innovation: updatedInnovation,
    });
  }
);

// Delet Innovation
export const deleteInnovation = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Find the innovation by ID and delete it
      const deletedInnovation = await Innovation.findByIdAndDelete(id);

      if (!deletedInnovation) {
        return res.status(404).json({ message: "Innovation not found." });
      }

      res.status(200).json({ message: "Innovation deleted successfully." });
    } catch (error) {
      console.error("Error deleting innovation:", error);
      res
        .status(500)
        .json({ message: "An error occurred while deleting the innovation." });
    }
  }
);
