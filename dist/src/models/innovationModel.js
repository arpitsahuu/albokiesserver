"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Define the schema for a paragraph
const paragraphSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
    },
    text: {
        type: String,
        required: [true, "Paragraph text is required"],
    },
});
// Define the schema for an innovation
const innovationSchema = new mongoose_1.default.Schema({
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
        default: [], // Default to an empty array if no tags are provided
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
        },
    ],
}, { timestamps: true } // Adds createdAt and updatedAt timestamps
);
// Create the Innovation model with the schema
const Innovation = mongoose_1.default.model("Innovation", innovationSchema);
exports.default = Innovation;
