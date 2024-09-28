import express from 'express';
import { isAutheticated } from '../middlewares/auth';

import { addEvent, allEvent, deleteEvent, editEvent } from '../controllers/eventController';


const eventRouter = express.Router();

// Add New User
eventRouter.post('/add/event',isAutheticated, addEvent);

// Edit Services
eventRouter.put('/edit/event/:id',isAutheticated, editEvent);

// Edit Services
eventRouter.delete('/event/:id',isAutheticated, deleteEvent);

// Get all services
eventRouter.get('/events',isAutheticated, allEvent);





export default eventRouter;
