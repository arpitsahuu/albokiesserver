"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middlewares/auth");
const cloudinary_1 = __importDefault(require("../middlewares/cloudinary"));
const router = express_1.default.Router();
// Add New User
router.post('/add/user', userController_1.addUser);
// User Login
router.post('/login', userController_1.userLogin);
//User Logout
router.post('/logout/:id', userController_1.userLongOut);
// Curr User
router.get('/me', auth_1.isAutheticated, userController_1.currUser);
// Revome User
router.get("/all/user", auth_1.isAutheticated, userController_1.allUsers);
// Update password 
router.put("/user/password", auth_1.isAutheticated, userController_1.updatePassword);
// Update User Info
router.put("/user/info", auth_1.isAutheticated, userController_1.updateUserInfo);
// Revome User
router.delete("/user/:id", auth_1.isAutheticated, userController_1.removeUser);
// Add Contact form data
router.post('/submit', userController_1.addContactForm);
// Add Contact form data
router.post('/submit/joinus', cloudinary_1.default.single('resume'), userController_1.addContactForm);
exports.default = router;
