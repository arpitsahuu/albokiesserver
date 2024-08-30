import mongoose, { Document, Model, Schema } from "mongoose";

// Define the interface for a paragraph
interface Paragraph {
  title: string; // Title of the paragraph
  text: string;  // Text content of the paragraph
}


// Define the interface for an event document
export interface IEvent extends Document {
  title: string;           
  description: string;     
  location: string;       
  date: Date;             
  organizer: string;       
  tags: string[];          
  isVirtual: boolean;    
  attendees: string[];   
  paragraphs: Paragraph[]; 
}



// Define the schema for a paragraph
const paragraphSchema: Schema<Paragraph> = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Paragraph title is required"],
    minlength: [3, "Paragraph title should be at least 3 characters long"],
  },
  text: {
    type: String,
    required: [true, "Paragraph text is required"],
  },
});

// Define the schema for an event
const eventSchema: Schema<IEvent> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      minlength: [3, "Event title should be at least 3 characters long"],
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    organizer: {
      type: String,
      required: [true, "Event organizer is required"],
    },
    tags: {
      type: [String], // Array of strings for tags
      default: [],    // Default to an empty array if no tags are provided
    },
    isVirtual: {
      type: Boolean,
      default: false, // Default to false (event is in-person by default)
    },
    attendees: {
      type: [String], // Array of attendee identifiers
      default: [],    // Default to an empty array if no attendees are registered
    },
    paragraphs: {
      type: [paragraphSchema], // Array of paragraphs for detailed descriptions
      required: [true, "Paragraphs are required"], // Ensures at least one paragraph
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);



// Create the Event model with the schema
const Event: Model<IEvent> = mongoose.model("Event", eventSchema);

export default Event;
