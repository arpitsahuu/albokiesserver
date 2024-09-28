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
exports.allEvent = exports.deleteEvent = exports.editEvent = exports.addEvent = void 0;
const catchAsyncError_1 = __importDefault(require("../middlewares/catchAsyncError"));
const eventModel_1 = __importDefault(require("../models/eventModel"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const redis_1 = require("../models/redis");
cloudinary_1.default.v2.config({
    cloud_name: "ddunz9xtw",
    api_key: process.env.CLOUDINARY_PUBLIC_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});
// Add Event
exports.addEvent = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, location, date, organizer, tags, isVirtual, details, } = req.body;
        // Validate input
        if (!title ||
            !description ||
            !location ||
            !date ||
            !organizer ||
            !details ||
            !details.length) {
            return res.status(400).json({
                message: "Please provide all required fields and at least one paragraph.",
            });
        }
        // Create a new event
        const newEvent = new eventModel_1.default({
            title,
            description,
            location,
            date,
            organizer,
            tags,
            isVirtual,
            details,
        });
        // Save the event to the database
        yield newEvent.save();
        const events = yield eventModel_1.default.find().exec();
        yield redis_1.redis.set("events", JSON.stringify(events));
        res
            .status(201)
            .json({ message: "Event created successfully", event: newEvent });
    }
    catch (error) {
        console.error("Error adding event:", error);
        res
            .status(500)
            .json({ message: "An error occurred while adding the event." });
    }
}));
// Edit Event
exports.editEvent = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, description, location, date, organizer, tags, isVirtual, attendees, details, } = req.body;
        console.log(req.body);
        // Update the event by ID
        const updatedEvent = yield eventModel_1.default.findByIdAndUpdate(id, {
            title,
            description,
            location,
            date,
            organizer,
            tags,
            isVirtual,
            attendees,
            details,
        }, { new: true, runValidators: true } // Returns the updated document and runs validation
        );
        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found." });
        }
        res
            .status(200)
            .json({ message: "Event updated successfully", event: updatedEvent });
    }
    catch (error) {
        console.error("Error updating event:", error);
        res
            .status(500)
            .json({ message: "An error occurred while updating the event." });
    }
}));
// Delet Events
exports.deleteEvent = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(id);
        // Find the event by ID and delete it
        const deletedEvent = yield eventModel_1.default.findByIdAndDelete(id);
        console.log(exports.deleteEvent);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found." });
        }
        res.status(200).json({ message: "Event deleted successfully." });
    }
    catch (error) {
        console.error("Error deleting event:", error);
        res
            .status(500)
            .json({ message: "An error occurred while deleting the event." });
    }
}));
exports.allEvent = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield eventModel_1.default.find().exec();
        res.status(200).json({
            message: "Event fatch events successfully.",
            success: true,
            events
        });
    }
    catch (error) {
        console.error("Error deleting event:", error);
        res
            .status(500)
            .json({ message: "An error occurred while deleting the event." });
    }
}));
