"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const eventController_1 = require("../controllers/eventController");
const eventRouter = express_1.default.Router();
// Add New User
eventRouter.post('/add/event', auth_1.isAutheticated, eventController_1.addEvent);
// Edit Services
eventRouter.put('/edit/event/:id', auth_1.isAutheticated, eventController_1.editEvent);
// Edit Services
eventRouter.delete('/event/:id', auth_1.isAutheticated, eventController_1.deleteEvent);
// Get all services
eventRouter.get('/events', auth_1.isAutheticated, eventController_1.allEvent);
exports.default = eventRouter;
