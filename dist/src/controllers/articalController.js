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
exports.allArticle = exports.deleteArtical = exports.editArtical = exports.addArtical = void 0;
const catchAsyncError_1 = __importDefault(require("../middlewares/catchAsyncError"));
const articalModel_1 = __importDefault(require("../models/articalModel"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const redis_1 = require("../models/redis");
cloudinary_1.default.v2.config({
    cloud_name: "ddunz9xtw",
    api_key: process.env.CLOUDINARY_PUBLIC_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});
// Add Artical
exports.addArtical = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { title, author, tags, image, details } = req.body;
    // Validate input
    if (!title || !author || !details || !image || details.length === 0) {
        return res.status(400).json({
            message: "Please provide all required fields, including at least one paragraph.",
        });
    }
    // console.log(req.body)
    if (image) {
        const articalImage = yield cloudinary_1.default.v2.uploader.upload(image === null || image === void 0 ? void 0 : image.url, {
            folder: "artical",
        });
        image = {
            public_id: articalImage.public_id,
            url: articalImage.secure_url,
        };
    }
    console.log(image);
    let newArticle = new articalModel_1.default({
        title,
        author,
        tags,
        details,
        image
    });
    console.log("one");
    console.log("tow");
    // Create a new article
    // Save the article to the database
    yield newArticle.save();
    const articles = yield articalModel_1.default.find();
    yield redis_1.redis.set("articles", JSON.stringify(articles));
    res
        .status(201)
        .json({
        message: "Article created successfully",
        article: newArticle,
        articles
    });
}));
// Edit Artical
exports.editArtical = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        let { title, author, tags, details, image } = req.body;
        // Find the article by ID and update it
        const updatedArticle = yield articalModel_1.default.findByIdAndUpdate(id, { title, author, tags, details }, { new: true, runValidators: true });
        if (!updatedArticle) {
            return res.status(404).json({ message: "Article not found." });
        }
        if ((image === null || image === void 0 ? void 0 : image.url) && image.url !== updatedArticle.image.url) {
            // Delete the old image from Cloudinary
            if (updatedArticle.image.public_id) {
                yield cloudinary_1.default.v2.uploader.destroy(updatedArticle.image.public_id);
            }
            // Upload the new image to Cloudinary
            const myCloud = yield cloudinary_1.default.v2.uploader.upload(image.url, {
                folder: "artical",
            });
            image = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
            yield updatedArticle.save();
        }
        const articles = articalModel_1.default.find();
        yield redis_1.redis.set("articles", JSON.stringify(articles));
        res.status(200).json({
            message: "Article updated successfully",
            article: updatedArticle,
            articles
        });
    }
    catch (error) {
        console.error("Error updating article:", error);
        res
            .status(500)
            .json({ message: "An error occurred while updating the article." });
    }
}));
// Delete Artical
exports.deleteArtical = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.params;
        console.log("enter");
        // Find the article by ID and delete it
        const deletedArticle = yield articalModel_1.default.findByIdAndDelete(id);
        console.log(exports.deleteArtical);
        if (!deletedArticle) {
            return res.status(404).json({ message: "Article not found." });
        }
        if ((_a = deletedArticle === null || deletedArticle === void 0 ? void 0 : deletedArticle.image) === null || _a === void 0 ? void 0 : _a.url) {
            yield cloudinary_1.default.v2.uploader.destroy((_b = deletedArticle === null || deletedArticle === void 0 ? void 0 : deletedArticle.image) === null || _b === void 0 ? void 0 : _b.public_id);
        }
        res.status(200).json({ message: "Article deleted successfully." });
    }
    catch (error) {
        console.error("Error deleting article:", error);
        res
            .status(500)
            .json({ message: "An error occurred while deleting the article." });
    }
}));
exports.allArticle = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articlesString = yield redis_1.redis.get("articles");
        if (articlesString) {
            const articles = yield JSON.parse(articlesString);
            console.log(articles);
            res.status(200).json({
                message: "Article deleted successfully.",
                success: true,
                articles
            });
        }
        const articles = yield articalModel_1.default.find();
        yield redis_1.redis.set("articles", JSON.stringify(articles));
        res.status(200).json({
            message: "Article deleted successfully.",
            success: true,
            articles
        });
    }
    catch (error) {
        console.error("Error deleting article:", error);
        res
            .status(500)
            .json({ message: "An error occurred while deleting the article." });
    }
}));
