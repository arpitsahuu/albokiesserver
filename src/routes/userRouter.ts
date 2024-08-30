import express from 'express';
import { addUser, allUsers, currUser, removeUser, userLogin, userLongOut } from '../controllers/userController';
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
router.get("/all/user", allUsers)

// Revome User
router.delete("/remove/user/:id", removeUser)



export default router;
