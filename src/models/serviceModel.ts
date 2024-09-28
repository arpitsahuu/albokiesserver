import mongoose, { Document, Model, Schema } from "mongoose";

export interface Paragraph {
  paragraphTitle?: string;
  text: string;
}

export interface IService extends Document {
  title: string;
  headline: string;
  image: {
    public_id: string;
    url: string;
  };
  tags: string[];
  details: {
    title?: string;
    paragraphs: string;
  }[];
}

// Define the schema for a service, including an optional title in the details
const serviceSchema: Schema<IService> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Service title is required"],
      minlength: [3, "Service title should be at least 3 characters long"],
    },
    headline: {
      type: String,
      required: [true, "Headline is required"],
      minlength: [3, "Headline should be at least 3 characters long"],
    },
    image: {
      public_id: {
        type: String,
        required: [true, "Image public_id is required"],
      },
      url: {
        type: String,
        required: [true, "Image URL is required"],
      },
    },
    tags: {
      type: [String],
      default: [],
    },
    details: [
      {
        title: {
          type: String,
          required: false, // Optional title for the details
        },
        paragraphs: {
          type: String,
          required: [true, "Paragraphs are required in details"],
        },
        image:{
          public_id: {
            type: String,
          },
          url: {
            type: String,
          },
        },
      },
    ],
  },
  { timestamps: true }
);

const Service: Model<IService> = mongoose.model("Service", serviceSchema);

export default Service;
