import express from 'express';
import { isAutheticated } from '../middlewares/auth';
import { addArtical, allArticle, deleteArtical, editArtical } from '../controllers/articalController';


const articalRouter = express.Router();

// Add New User
articalRouter.post('/add/artical',isAutheticated, addArtical);

// Edit Services
articalRouter.put('/edit/artical/:id',isAutheticated, editArtical);

// Edit Services
articalRouter.delete('/artical/:id',isAutheticated, deleteArtical);


// Get all services
articalRouter.get('/articles',isAutheticated, allArticle);





export default articalRouter;
