"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: "ddunz9xtw",
    api_key: process.env.CLOUDINARY_PUBLIC_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});
console.log('Cloudinary configured with cloud name:', process.env.CLOUDINARY_PUBLIC_KEY);
// Configure Cloudinary storage
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
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
    }),
});
// Create Multer instance using Cloudinary storage
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Max file size: 5MB
    },
});
// Log when the upload instance is created
console.log('Multer upload instance created');
exports.default = upload;
