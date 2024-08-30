import mongoose, { Document, Model, Schema } from "mongoose";

// Define the interface for a paragraph
interface Paragraph {
  title?: string; // Title of the paragraph
  text: string;  // Text content of the paragraph
}

// Define the interface for an innovation document
export interface IInnovation extends Document {
  title: string;           
  description: string;     
  author: string;          
  dateOfCreation: Date;    
  tags: string[];          
  status: string;          
  impact: string;          
  paragraphs: Paragraph[]; 
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

// Define the schema for an innovation
const innovationSchema: Schema<IInnovation> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Innovation title is required"],
      minlength: [3, "Innovation title should be at least 3 characters long"],
    },
    description: {
      type: String,
      required: [true, "Innovation description is required"],
    },
    author: {
      type: String,
      required: [true, "Author of the innovation is required"],
    },
    dateOfCreation: {
      type: Date,
      required: [true, "Date of creation is required"],
    },
    tags: {
      type: [String], // Array of strings for tags
      default: [],    // Default to an empty array if no tags are provided
    },
    status: {
      type: String,
      enum: ["Concept", "In Development", "Completed", "Deprecated"], // Predefined status options
      default: "Concept", // Default to "Concept"
      required: [true, "Status of the innovation is required"],
    },
    impact: {
      type: String,
      required: [true, "Impact of the innovation is required"],
    },
    paragraphs: {
      type: [paragraphSchema], // Array of paragraphs for detailed descriptions or features
      required: [true, "At least one paragraph is required"], // Ensures at least one paragraph
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);

// Create the Innovation model with the schema
const Innovation: Model<IInnovation> = mongoose.model("Innovation", innovationSchema);

export default Innovation;
