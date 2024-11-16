import express from "express";
import { createTable, getAllTable, getTableByReservationId } from "../controllers/tableController.js";
import { adminAuth } from "../middleware/auth.js";

const tableRoute = express.Router();

tableRoute.post("/", adminAuth, createTable)
tableRoute.get("/", adminAuth, getAllTable)
tableRoute.get("/:reservationId", getTableByReservationId)

export default tableRoute;
