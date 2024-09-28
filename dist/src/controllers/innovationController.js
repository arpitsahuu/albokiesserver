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
exports.deleteInnovation = exports.editInnovation = exports.addInnovation = void 0;
const catchAsyncError_1 = __importDefault(require("../middlewares/catchAsyncError"));
const innovationModel_1 = __importDefault(require("../models/innovationModel"));
// Add Innovation
exports.addInnovation = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, author, dateOfCreation, tags, status, impact, paragraphs, } = req.body;
    // Validate required fields
    if (!title ||
        !description ||
        !author ||
        !dateOfCreation ||
        !impact ||
        !paragraphs ||
        paragraphs.length === 0) {
        return res.status(400).json({
            message: "All required fields must be provided, including at least one paragraph.",
        });
    }
    // Create a new innovation
    const newInnovation = new innovationModel_1.default({
        title,
        description,
        author,
        dateOfCreation,
        tags,
        status,
        impact,
        paragraphs,
    });
    // Save the innovation to the database
    yield newInnovation.save();
    res.status(201).json({
        message: "Innovation created successfully",
        innovation: newInnovation,
    });
}));
// Edit Innovation
exports.editInnovation = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updateData = req.body;
    // Validate input
    if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No data provided for update." });
    }
    // Find the innovation by ID and update it
    const updatedInnovation = yield innovationModel_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedInnovation) {
        return res.status(404).json({ message: "Innovation not found." });
    }
    res.status(200).json({
        message: "Innovation updated successfully",
        innovation: updatedInnovation,
    });
}));
// Delet Innovation
exports.deleteInnovation = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Find the innovation by ID and delete it
        const deletedInnovation = yield innovationModel_1.default.findByIdAndDelete(id);
        if (!deletedInnovation) {
            return res.status(404).json({ message: "Innovation not found." });
        }
        res.status(200).json({ message: "Innovation deleted successfully." });
    }
    catch (error) {
        console.error("Error deleting innovation:", error);
        res
            .status(500)
            .json({ message: "An error occurred while deleting the innovation." });
    }
}));
