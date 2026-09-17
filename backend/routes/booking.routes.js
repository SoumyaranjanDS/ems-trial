import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { createBooking, getMyBookings } from "../controllers/booking.controller.js";

const bookingRoutes = express.Router();

bookingRoutes.post("/create", verifyToken, createBooking);
bookingRoutes.get("/my-bookings", verifyToken, getMyBookings);

export default bookingRoutes;
