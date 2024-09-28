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
exports.allService = exports.deleteService = exports.editService = exports.addService = void 0;
const catchAsyncError_1 = __importDefault(require("../middlewares/catchAsyncError"));
const serviceModel_1 = __importDefault(require("../models/serviceModel"));
// import { cloud } from "../middlewares/cloudinary";
const cloudinary_1 = __importDefault(require("cloudinary"));
const redis_1 = require("../models/redis");
cloudinary_1.default.v2.config({
    cloud_name: "ddunz9xtw",
    api_key: process.env.CLOUDINARY_PUBLIC_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});
// Add Services
// export const addService = catchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     let { title, headline, image, tags, details } = req.body;
//     console.log(req.body);
//     // Validate input
//     if (
//       !title ||
//       !headline ||
//       !image ||
//       !image.url ||
//       !tags ||
//       !Array.isArray(tags) ||
//       tags.length === 0 ||
//       !details ||
//       !Array.isArray(details) ||
//       details.length === 0
//     ) {
//       return res
//         .status(400)
//         .json({ message: "Please provide all required fields." });
//     }
//     // Check details structure
//     const isValidDetails = details.every(
//       (detail: { title?: string; paragraphs: string }) => {
//         return (
//           typeof detail.paragraphs === "string" &&
//           detail.paragraphs.trim().length > 0
//         );
//       }
//     );
//     if (!isValidDetails) {
//       return res
//         .status(400)
//         .json({
//           message:
//             "Each detail must include at least a 'paragraphs' field with text.",
//         });
//     }
//     if (image?.url) {
//       const myCloud = await cloudinary.v2.uploader.upload(image?.url, {
//         folder: "Services",
//       });
//       image = {
//         public_id: myCloud.public_id,
//         url: myCloud.secure_url,
//       };
//     }
//     // Create a new service
//     const newService = new Service({
//       title,
//       headline,
//       image,
//       tags,
//       details,
//     });
//     // Save the service to the database
//     await newService.save();
//     // const services = await Service.find().exec();x
//     // await redis.set("service", JSON.stringify(services));
//     res.status(201).json({
//       message: "Service created successfully",
//       service: newService,
//     });
//   }
// );
exports.addService = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { title, headline, image, tags, details } = req.body;
        // console.log(req.body);
        console.log(details);
        // Validate input
        if (!title ||
            !headline ||
            !image ||
            !image.url ||
            !tags ||
            !Array.isArray(tags) ||
            tags.length === 0 ||
            !details ||
            !Array.isArray(details) ||
            details.length === 0) {
            return res
                .status(400)
                .json({ message: "Please provide all required fields." });
        }
        // Check details structure
        const isValidDetails = details.every((detail) => {
            return (typeof detail.paragraphs === "string" &&
                detail.paragraphs.trim().length > 0);
        });
        console.log(isValidDetails);
        if (!isValidDetails) {
            return res.status(400).json({
                message: "Each detail must include valid paragraphs and optional image fields.",
            });
        }
        // Handle the main image upload
        if (image === null || image === void 0 ? void 0 : image.url) {
            const myCloud = yield cloudinary_1.default.v2.uploader.upload(image === null || image === void 0 ? void 0 : image.url, {
                folder: "Services",
            });
            console.log(image);
            image = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        console.log("three");
        // Handle image uploads for each detail if available
        const updatedDetails = yield Promise.all(details.map((detail) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if ((_a = detail.image) === null || _a === void 0 ? void 0 : _a.url) {
                const detailImageUpload = yield cloudinary_1.default.v2.uploader.upload(detail.image.url, {
                    folder: "ServiceDetails",
                });
                return Object.assign(Object.assign({}, detail), { image: {
                        public_id: detailImageUpload.public_id,
                        url: detailImageUpload.secure_url,
                    } });
            }
            return detail; // If no image, return the detail as-is
        })));
        // Create a new service
        const newService = new serviceModel_1.default({
            title,
            headline,
            image,
            tags,
            details: updatedDetails,
        });
        // Save the service to the database
        yield newService.save();
        res.status(201).json({
            message: "Service created successfully",
            service: newService,
        });
    }
    catch (error) {
        console.log(error);
        res.json({
            message: "unsjakj"
        });
    }
}));
// Edit Services
exports.editService = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let { title, headline, image, tags, details } = req.body;
    console.log("call");
    console.log(title);
    // Fetch the existing service from the database
    let service = yield serviceModel_1.default.findById(id);
    if (!service) {
        return res.status(404).json({ message: "Service not found" });
    }
    // Validate input
    if (!title ||
        !headline ||
        !tags ||
        !Array.isArray(tags) ||
        tags.length === 0 ||
        !details ||
        !Array.isArray(details) ||
        details.length === 0) {
        return res
            .status(400)
            .json({ message: "Please provide all required fields." });
    }
    // Validate each detail in the details array
    const isValidDetails = details.every((detail) => {
        return ((!detail.title || typeof detail.title === "string") && // title is optional but must be a string if provided
            typeof detail.paragraphs === "string" &&
            detail.paragraphs.trim().length > 0);
    });
    if (!isValidDetails) {
        return res.status(400).json({
            message: "Each detail must include at least a 'paragraphs' field with text.",
        });
    }
    // Handle image update if necessary
    if (image && image.url && image.url !== service.image.url) {
        // Delete the old image from Cloudinary
        if (service.image.public_id) {
            yield cloudinary_1.default.v2.uploader.destroy(service.image.public_id);
        }
        // Upload the new image to Cloudinary
        const myCloud = yield cloudinary_1.default.v2.uploader.upload(image.url, {
            folder: "Services",
        });
        service.image = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }
    // Update service fields
    service.title = title;
    service.headline = headline;
    service.tags = tags;
    service.details = details;
    console.log(service.title);
    // Save the updated service to the database
    yield service.save();
    console.log(service.title);
    console.log(service, "updated data");
    // Fetch services from Redis
    const servicesString = yield redis_1.redis.get("services");
    if (servicesString) {
        let services = JSON.parse(servicesString);
        console.log(services, "for redis1");
        // Update the service in the cached data
        const servicesnew = services.map((s) => s._id === id ? service : s);
        console.log(servicesnew, "fomr reids");
        // Save the updated services list back to Redis
        yield redis_1.redis.set("services", JSON.stringify(services));
    }
    res.status(200).json({
        message: "Service updated successfully",
        service,
    });
}));
// Delete Services
exports.deleteService = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Find the service by ID and delete it
    const deletedService = yield serviceModel_1.default.findByIdAndDelete(id);
    if (!deletedService) {
        return res.status(404).json({ message: "Service not found." });
    }
    res.status(200).json({ message: "Service deleted successfully" });
}));
// Add Services
exports.allService = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const services = yield serviceModel_1.default.find().sort({ createdAt: -1 }).exec();
    console.log(services);
    res.status(200).json({
        succeess: true,
        services: services,
    });
}));
