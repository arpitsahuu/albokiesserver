"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const serviceController_1 = require("../controllers/serviceController");
const serviceRouter = express_1.default.Router();
// Add New User
serviceRouter.post('/add/service', serviceController_1.addService);
// Edit Services
// serviceRouter.put('/edit/service/:id',isAutheticated, editService);
// Edit Services
serviceRouter.delete('/services/:id', auth_1.isAutheticated, serviceController_1.deleteService);
// Get all services
serviceRouter.get('/services', serviceController_1.allService);
exports.default = serviceRouter;
