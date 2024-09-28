"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Define the schema for a service, including an optional title in the details
const serviceSchema = new mongoose_1.default.Schema({
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
            image: {
                public_id: {
                    type: String,
                },
                url: {
                    type: String,
                },
            },
        },
    ],
}, { timestamps: true });
const Service = mongoose_1.default.model("Service", serviceSchema);
exports.default = Service;
