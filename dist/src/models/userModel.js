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
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "First name is required"],
        minLenght: [3, "Name should be atleast 3 character long"],
    },
    email: {
        type: String,
        unique: true,
        require: [true, "Email is required"],
    },
    password: {
        type: String,
        select: false,
    },
    refreshToken: {
        type: String,
        default: "0",
        select: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        emum: ["user", "admin"],
        default: "user",
    },
}, { timestamps: true });
userModel.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password")) {
            next();
        }
        this.password = yield bcryptjs_1.default.hash(this.password, 10);
        next();
    });
});
userModel.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        let match = yield bcryptjs_1.default.compare(password, this.password);
        return match;
    });
};
userModel.methods.generateAccesToken = function () {
    const token = process.env.ACCESS_TOKEN_SECRET || "";
    return jsonwebtoken_1.default.sign({
        _id: this._id,
        email: this.email,
    }, token, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
};
userModel.methods.generateRefreashToken = function () {
    const token = process.env.REFRESH_TOKEN_SECRET || "";
    return jsonwebtoken_1.default.sign({
        _id: this._id,
    }, token, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
};
const User = mongoose_1.default.model("user", userModel);
exports.default = User;
