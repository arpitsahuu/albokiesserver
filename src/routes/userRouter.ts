import express from 'express';
import { addUser, allUsers, currUser, removeUser, updatePassword, updateUserInfo, userLogin, userLongOut } from '../controllers/userController';
import { isAutheticated } from '../middlewares/auth';

const router = express.Router();

// Add New User
router.post('/add/user', addUser);

// User Login
router.post('/login', userLogin);

//User Logout
router.post('/logout/:id', userLongOut);

// Curr User
router.get('/me',isAutheticated, currUser);

// Revome User
router.get("/all/user",isAutheticated, allUsers)

// Update password 
router.put("/user/password",isAutheticated, updatePassword)

// Update User Info
router.put("/user/info",isAutheticated ,updateUserInfo)

// Revome User
router.delete("/user/:id",isAutheticated, removeUser)



export default router;
