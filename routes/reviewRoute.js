import express from "express";
import { createReview, getAllReviews } from "../controllers/reviewController.js";
import { userAuth } from "../middleware/auth.js";

const reviewRoute = express.Router();

reviewRoute.post('/', userAuth, createReview)
reviewRoute.get('/', getAllReviews)

export default reviewRoute;
