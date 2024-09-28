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
exports.updatePassword = exports.updateUserInfo = exports.removeUser = exports.allUsers = exports.userLongOut = exports.currUser = exports.userLogin = exports.addUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const catchAsyncError_1 = __importDefault(require("../middlewares/catchAsyncError"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const redis_1 = require("../models/redis");
const generateTokens_1 = require("../utils/generateTokens");
exports.addUser = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const requestBody: IRegistrationBody = req.body as IRegistrationBody ;
    console.log(req.body);
    const { name, email, password } = req.body;
    if (!name || !email || !password)
        return next(new errorHandler_1.default(`fill all deatils`));
    const isEmailExit = yield userModel_1.default.findOne({ email: email });
    if (isEmailExit)
        return next(new errorHandler_1.default("User With This Email Address Already Exits"));
    const ActivationCode = Math.floor(1000 + Math.random() * 9000);
    const newUser = yield userModel_1.default.create({
        name,
        email,
        password,
        isVerified: true,
    });
    const userCount = yield userModel_1.default.countDocuments().exec();
    let countString = yield redis_1.redis.get("count");
    if (countString) {
        const count = yield JSON.parse(countString);
        count.userCounts = userCount;
        yield redis_1.redis.set("count", JSON.stringify(count));
    }
    res
        .status(201)
        .json({
        succcess: true,
        message: "successfully Add new user",
        user: newUser,
    });
}));
exports.userLogin = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password)
        return next(new errorHandler_1.default("Pleas fill all details"));
    // const user: IUser | null = await User.findOne({ email: email }).populate("cou").select("+password -courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links")
    const user = yield userModel_1.default.findOne({ email: email }).select("+password").exec();
    console.log(user);
    if (!user)
        return next(new errorHandler_1.default("User Not Found With this Email", 401));
    const isMatch = yield user.comparePassword(password);
    if (!isMatch)
        return next(new errorHandler_1.default("Wrong Credientials", 401));
    const tokens = (0, generateTokens_1.generateTokens)(user);
    user.refreshToken = tokens.refreshToken;
    yield user.save();
    user.password = "";
    // await redis.set(user._id, JSON.stringify(user));
    const options = {
        httpOnly: true,
        secure: true,
    };
    res
        .status(200)
        .cookie("accessToken", tokens === null || tokens === void 0 ? void 0 : tokens.accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "none"
    })
        .cookie("refreshToken", tokens === null || tokens === void 0 ? void 0 : tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "none"
    })
        .json({
        succcess: true,
        message: "successfully login",
        user: user,
        accessToken: tokens === null || tokens === void 0 ? void 0 : tokens.accessToken,
        refreshToken: tokens === null || tokens === void 0 ? void 0 : tokens.accessToken,
    });
}));
exports.currUser = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            next(new errorHandler_1.default("user not lonin", 401));
        }
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
}));
exports.userLongOut = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const id = req.user?._id;
    const id = req.params.id;
    console.log(id);
    if (!id)
        return next(new errorHandler_1.default("login to user the resorse", 404));
    yield userModel_1.default.findByIdAndUpdate(id, {
        $set: {
            refreshToken: undefined,
        },
    });
    // await redis.del(id);
    const options = {
        httpOnly: true,
        secure: true,
    };
    res.clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
        succcess: true,
        message: "successfully logout",
    });
}));
exports.allUsers = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userModel_1.default.find().exec();
    res.json({
        succcess: true,
        users: users
    });
}));
exports.removeUser = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user = yield userModel_1.default.findById(id).exec();
    if (!user) {
        return next(new errorHandler_1.default("User not found", 404));
    }
    yield userModel_1.default.findByIdAndDelete(id);
    res.json({
        succcess: true,
        message: "Revome user"
    });
}));
exports.updateUserInfo = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let { name, email } = req.body;
        console.log(req.body);
        // Check if the user is authenticated
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const user = yield userModel_1.default.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true });
        // let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const tokens = (0, generateTokens_1.generateTokens)(user);
        user.refreshToken = tokens.refreshToken;
        yield user.save();
        user.password = "";
        // await redis.set(user._id, JSON.stringify(user));
        const options = {
            httpOnly: true,
            secure: true,
        };
        res
            .status(200)
            .cookie("accessToken", tokens === null || tokens === void 0 ? void 0 : tokens.accessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "none"
        })
            .cookie("refreshToken", tokens === null || tokens === void 0 ? void 0 : tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "none"
        })
            .json({
            succcess: true,
            message: "successfully update the user",
            user: user,
            accessToken: tokens === null || tokens === void 0 ? void 0 : tokens.accessToken,
            refreshToken: tokens === null || tokens === void 0 ? void 0 : tokens.accessToken,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}));
exports.updatePassword = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { currentPassword, newPassword } = req.body;
        // Check if the user is authenticated
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
        const user = yield userModel_1.default.findById(userId).select("+password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Check if the current password is correct
        const isMatch = yield user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }
        // Hash the new password and update the user document
        user.password = newPassword;
        yield user.save();
        res.status(200).json({ message: "Password updated successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}));
