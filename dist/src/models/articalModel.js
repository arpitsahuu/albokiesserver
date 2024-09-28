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
// Define the schema for an article
const articleSchema = new mongoose_1.default.Schema({
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
        default: [], // Default to an empty array if no tags are provided
    },
    publishedDate: {
        type: Date,
        default: Date.now, // Defaults to the current date
    },
    image: {
        public_id: String,
        url: String
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
// Create the Article model with the schema
const Article = mongoose_1.default.model("Article", articleSchema);
exports.default = Article;
