import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the Contact Form
export interface IContactForm extends Document {
  name: string;
  email: string;
  contact: string;
  message: string;
  createdAt: Date;
}

// Define the schema using the interface
const contactFormSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    contact: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

// Create a Mongoose model using the schema and export it
const ContactForm = mongoose.model<IContactForm>(
  "ContactForm",
  contactFormSchema
);
export default ContactForm;
