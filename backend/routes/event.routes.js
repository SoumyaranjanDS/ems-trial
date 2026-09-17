import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import checkOrganizer from "../middlewares/organizer.js";
import {
  handelCreateEvent,
  handelGetAllEvents,
  handelGetEventById,
  handelGetMyEvents,
  handelDeleteEvent
} from "../controllers/event.controller.js";

const eventRoutes = express.Router();

eventRoutes.post(
  "/create-event",
  verifyToken,
  checkOrganizer,
  handelCreateEvent,
);
eventRoutes.get("/all", handelGetAllEvents);
eventRoutes.get("/my-events", verifyToken, checkOrganizer, handelGetMyEvents);
eventRoutes.get("/:id", handelGetEventById);
eventRoutes.delete("/:id", verifyToken, checkOrganizer, handelDeleteEvent);

export default eventRoutes;
