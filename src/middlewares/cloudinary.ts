import { v2 as cloudinary } from 'cloudinary';
import { Request } from 'express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
    cloud_name: "ddunz9xtw",
    api_key: process.env.CLOUDINARY_PUBLIC_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

console.log('Cloudinary configured with cloud name:', process.env.CLOUDINARY_PUBLIC_KEY);

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req: Request, file: Express.Multer.File) => {
        console.log('Preparing to upload file:', file.originalname); // Log the file name

        // Check if the file type is PDF
        if (file.mimetype !== 'application/pdf') {
            console.error('Unsupported file format:', file.mimetype); // Log unsupported file types
            throw new Error('Unsupported file format');
        }

        return {
            folder: 'resumes',
            format: 'pdf', // Force resume files to be in PDF format
            public_id: file.originalname.split('.')[0], // Optional: public ID for the file in Cloudinary
        };
    },
});

// Create Multer instance using Cloudinary storage
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Max file size: 5MB
    },
});

// Log when the upload instance is created
console.log('Multer upload instance created');

export default upload;
