import express from 'express';
import { isAutheticated } from '../middlewares/auth';
import { addService } from '../controllers/serviceController';

const serviceRouter = express.Router();

// Add New User
serviceRouter.post('/add/service',isAutheticated, addService);







export default serviceRouter;
