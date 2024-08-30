import mongoose, { Document, Model, Schema } from "mongoose";

// Define the interface for a paragraph
interface Paragraph {
  title?: string; // Title of the paragraph (optional)
  text: string;   // Text content of the paragraph (required)
}

// Define the schema for a paragraph
const paragraphSchema: Schema<Paragraph> = new mongoose.Schema({
  title: {
    type: String,
  },
  text: {
    type: String,
    required: [true, "Paragraph text is required"],
  },
});

// Define the interface for an article document
export interface IArticle extends Document {
  title: string;          // Title of the article
  author: string;         // Author of the article
  tags: string[];         // Array of tags associated with the article
  publishedDate: Date;    // Date when the article was published
  paragraphs: Paragraph[]; // Array of paragraphs for detailed descriptions
  image: {
    public_id: string;
    url: string;
  };
}

// Define the schema for an article
const articleSchema: Schema<IArticle> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Article title is required"],
      minlength: [3, "Article title should be at least 3 characters long"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
    },
    tags: {
      type: [String], // Array of strings for tags
      default: [],    // Default to an empty array if no tags are provided
    },
    publishedDate: {
      type: Date,
      default: Date.now, // Defaults to the current date
    },
    image: {
      type: Object,
      public_id:String,
      url:String
    },
    paragraphs: {
      type: [paragraphSchema], // Array of paragraphs for detailed descriptions
      required: [true, "At least one paragraph is required"], // Ensures at least one paragraph
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);

// Create the Article model with the schema
const Article: Model<IArticle> = mongoose.model("Article", articleSchema);

export default Article;
