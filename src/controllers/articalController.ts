import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middlewares/catchAsyncError";
import Article from "../models/articalModel";
import cloudinary from "cloudinary"
import { redis } from "../models/redis";

cloudinary.v2.config({
  cloud_name: "ddunz9xtw",
  api_key: process.env.CLOUDINARY_PUBLIC_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Add Artical
export const addArtical = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
      let { title, author, tags,  image, details } = req.body;

      // Validate input
      if (!title || !author || !details || !image || details.length === 0) {
        return res.status(400).json({
          message:
            "Please provide all required fields, including at least one paragraph.",
        });
      }

      // console.log(req.body)

      if(image){
        const articalImage = await cloudinary.v2.uploader.upload(image?.url,{
          folder: "artical",
        });
        image= {
          public_id: articalImage.public_id,
          url: articalImage.secure_url,
        }
      }
      console.log(image)

      let newArticle = new Article({
        title,
        author,
        tags,
        details,
        image
      });
      console.log("one")


      console.log("tow")

      // Create a new article
      

      // Save the article to the database
      await newArticle.save();
      const articles = await Article.find();
      await redis.set("articles",JSON.stringify(articles))

      res
        .status(201)
        .json({ 
          message: "Article created successfully", 
          article: newArticle,
          articles
         });

  }
);

// Edit Artical
export const editArtical = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      let { title, author, tags, details,image } = req.body;

      // Find the article by ID and update it
      const updatedArticle = await Article.findByIdAndUpdate(
        id,
        { title, author, tags, details},
        { new: true, runValidators: true }
      );

      if (!updatedArticle) {
        return res.status(404).json({ message: "Article not found." });
      }

      if (image?.url && image.url !== updatedArticle.image.url) {
        // Delete the old image from Cloudinary
        if (updatedArticle.image.public_id) {
          await cloudinary.v2.uploader.destroy(updatedArticle.image.public_id);
        }

        // Upload the new image to Cloudinary
        const myCloud = await cloudinary.v2.uploader.upload(image.url, {
          folder: "artical",
        });
  
        image = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
        await updatedArticle.save();
      } 

      const articles = Article.find();
      await redis.set("articles",JSON.stringify(articles))

      res.status(200).json({
        message: "Article updated successfully",
        article: updatedArticle,
        articles
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
      console.log("enter")

      // Find the article by ID and delete it
      const deletedArticle = await Article.findByIdAndDelete(id);  

      console.log(deleteArtical)
      
      if (!deletedArticle) {
        return res.status(404).json({ message: "Article not found." });
      }
      
      if(deletedArticle?.image?.url){
        await cloudinary.v2.uploader.destroy(deletedArticle?.image?.public_id);
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


export const allArticle = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      const articlesString = await redis.get("articles");


      if(articlesString){
        const articles = await JSON.parse(articlesString);
        console.log(articles)
        res.status(200).json({ 
          message: "Article deleted successfully.", 
          success:true,
          articles
         });
      } 
      
      const articles = await Article.find();  

      await redis.set("articles",JSON.stringify(articles));

      res.status(200).json({ 
        message: "Article deleted successfully.", 
        success:true,
        articles
       });
    } catch (error) {
      console.error("Error deleting article:", error);
      res
        .status(500)
        .json({ message: "An error occurred while deleting the article." });
    }
  }
);
