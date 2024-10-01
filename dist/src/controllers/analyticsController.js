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
exports.dataCount = void 0;
const catchAsyncError_1 = __importDefault(require("../middlewares/catchAsyncError"));
const serviceModel_1 = __importDefault(require("../models/serviceModel"));
const articalModel_1 = __importDefault(require("../models/articalModel"));
const eventModel_1 = __importDefault(require("../models/eventModel"));
// import { redis } from "../models/redis";
const userModel_1 = __importDefault(require("../models/userModel"));
exports.dataCount = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const countData = await redis.get("count");
    const serviceCount = yield serviceModel_1.default.countDocuments().exec();
    const articalCount = yield articalModel_1.default.countDocuments().exec();
    const eventsCounts = yield eventModel_1.default.countDocuments().exec();
    const userCounts = yield userModel_1.default.countDocuments().exec();
    const count = {
        serviceCount: serviceCount,
        articalCount: articalCount,
        eventsCounts: eventsCounts,
        userCounts: userCounts,
    };
    // await redis.set("count", JSON.stringify(count));
    res.status(200).json({
        success: true,
        count
    });
    // if (!countData) {
    // } else{
    //     const count = await JSON.parse(countData)
    //     res.status(200).json({
    //         success:true,
    //         count
    //     })
    // }
}));
