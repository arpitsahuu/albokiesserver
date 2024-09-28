"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const analyticsController_1 = require("../controllers/analyticsController");
const analyticsRouter = express_1.default.Router();
// Add New User
analyticsRouter.get('/count', auth_1.isAutheticated, analyticsController_1.dataCount);
exports.default = analyticsRouter;
