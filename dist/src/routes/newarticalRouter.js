"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const articalController_1 = require("../controllers/articalController");
const articalRouter = express_1.default.Router();
// Add New User
articalRouter.post('/add/artical', auth_1.isAutheticated, articalController_1.addArtical);
// Edit Services
articalRouter.put('/edit/artical/:id', auth_1.isAutheticated, articalController_1.editArtical);
// Edit Services
articalRouter.delete('/artical/:id', auth_1.isAutheticated, articalController_1.deleteArtical);
// Get all services
articalRouter.get('/articles', auth_1.isAutheticated, articalController_1.allArticle);
exports.default = articalRouter;
