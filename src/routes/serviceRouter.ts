import express from 'express';
import { isAutheticated } from '../middlewares/auth';
import { addService, allService,  deleteService,  editService } from '../controllers/serviceController';


const serviceRouter = express.Router();

// Add New User
serviceRouter.post('/add/service', addService);

// Edit Services
// serviceRouter.put('/edit/service/:id',isAutheticated, editService);

// Edit Services
serviceRouter.delete('/services/:id',isAutheticated, deleteService);



// Get all services
serviceRouter.get('/services', allService);






export default serviceRouter;
