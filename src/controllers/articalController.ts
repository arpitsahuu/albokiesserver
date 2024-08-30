import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middlewares/catchAsyncError";
import Article from "../models/articalModel";
import { cloud } from "../middlewares/cloudinary";

// Add Artical
export const addArtical = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, author, tags, publishedDate, paragraphs, image } = req.body;

      // Validate input
      if (!title || !author || !paragraphs || !image || paragraphs.length === 0) {
        return res.status(400).json({
          message:
            "Please provide all required fields, including at least one paragraph.",
        });
      }

      const newArticle = new Article({
        title,
        author,
        tags,
        publishedDate,
        paragraphs,
      });

      if(image){
        const articalImage = await cloud.v2.uploader.upload(image,{
          folder: "artical",
        });
        newArticle.image= {
          public_id: articalImage.public_id,
          url: articalImage.secure_url,
        }
      }

      // Create a new article
      

      // Save the article to the database
      await newArticle.save();

      res
        .status(201)
        .json({ message: "Article created successfully", article: newArticle });
    } catch (error) {
      console.error("Error adding article:", error);
      res
        .status(500)
        .json({ message: "An error occurred while adding the article." });
    }
  }
);

// Edit Artical
export const editArtical = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { title, author, tags, publishedDate, paragraphs,image } = req.body;

      // Find the article by ID and update it
      const updatedArticle = await Article.findByIdAndUpdate(
        id,
        { title, author, tags, publishedDate, paragraphs },
        { new: true, runValidators: true }
      );

      if (!updatedArticle) {
        return res.status(404).json({ message: "Article not found." });
      }

      res.status(200).json({
        message: "Article updated successfully",
        article: updatedArticle,
      });
    } catch (error) {
      console.error("Error updating article:", error);
      res
        .status(500)
        .json({ message: "An error occurred while updating the article." });
    }
  }
);

// Delete Artical
export const deleteArtical = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Find the article by ID and delete it
      const deletedArticle = await Article.findByIdAndDelete(id);

      if (!deletedArticle) {
        return res.status(404).json({ message: "Article not found." });
      }

      res.status(200).json({ message: "Article deleted successfully." });
    } catch (error) {
      console.error("Error deleting article:", error);
      res
        .status(500)
        .json({ message: "An error occurred while deleting the article." });
    }
  }
);
