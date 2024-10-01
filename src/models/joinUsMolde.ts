import mongoose, { Document, Schema } from 'mongoose';

interface IContactForm extends Document {
  name: string;
  email: string;
  contactNumber: string;
  resume: {
    public_id: string;
    url: string;
  }
  position: 'Internship' | 'Job';
}

const contactFormSchema: Schema<IContactForm> = new Schema({
  name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
    trim: true,
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true,
  },
  resume: {
    public_id:String,
    url:String,
    required: [true, 'Resume is required'],
  },
  position: {
    type: String,
    enum: ['Internship', 'Job'],
    required: [true, 'Position selection is required'],
  },
});

const JoinUsForm = mongoose.model<IContactForm>('JoinUsForm', contactFormSchema);

export default JoinUsForm;
