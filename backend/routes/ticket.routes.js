import express from "express";
import {
  verifyTicket,
  checkInTicket,
  getMyTickets,
} from "../controllers/ticket.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/my-tickets", verifyToken, getMyTickets);
router.get("/verify/:ticketId", verifyTicket);
router.post("/:ticketId/check-in", verifyToken, checkInTicket);

export default router;
