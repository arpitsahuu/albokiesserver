import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

// Define the storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes'); // Destination folder for resume uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Generate a unique file name
  },
});

// File filter for only accepting PDF files
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = /pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // Accept file if it's a valid PDF
  } else {
    cb(new Error('Only PDF files are allowed')); // Reject other file types
  }
};

// Multer instance configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Maximum file size of 5MB
  },
  fileFilter: fileFilter,
});

export default upload;
