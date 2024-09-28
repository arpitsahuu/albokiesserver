import express from 'express';
import { isAutheticated } from '../middlewares/auth';
import { dataCount } from '../controllers/analyticsController';

const analyticsRouter = express.Router();



// Add New User
analyticsRouter.get('/count',isAutheticated, dataCount);





export default analyticsRouter;
