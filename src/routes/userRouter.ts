import express from 'express';
import { addContactForm, addUser, allUsers, currUser, removeUser, updatePassword, updateUserInfo, userLogin, userLongOut } from '../controllers/userController';
import { isAutheticated } from '../middlewares/auth';
// import upload from '../middlewares/cloudinary';

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


// Add Contact form data
router.post('/submit', addContactForm);

// Add Contact form data
// router.post('/submit/joinus', upload.single('resume'), addContactForm);





export default router;
