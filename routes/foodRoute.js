import express from 'express'
import {listFood,addFood,removeFood,singleFood} from "../controllers/foodController.js"
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const foodRouter = express.Router();


foodRouter.post('/add',adminAuth, upload.fields([
                                        { name: 'image1', maxCount: 1 },
                                      ]), addFood);
foodRouter.post('/remove',adminAuth,removeFood);
foodRouter.post('/single',singleFood);
foodRouter.get('/list',listFood);

export default foodRouter
