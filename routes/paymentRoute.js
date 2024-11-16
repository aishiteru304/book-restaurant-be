import express from "express";
import { createInvoice, createPaymentLink } from "../controllers/paymentController.js";

const paymentRoute = express.Router();

paymentRoute.post("/", createPaymentLink)
paymentRoute.post("/invoice", createInvoice)

export default paymentRoute;
