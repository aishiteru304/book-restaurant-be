import express from "express";
import { createReservation, getAllReservation } from "../controllers/reservationController.js";
import { userAuth, adminAuth } from "../middleware/auth.js";

const reservationRouter = express.Router();

reservationRouter.post("/", userAuth, createReservation)
reservationRouter.get("/", adminAuth, getAllReservation)

export default reservationRouter;
