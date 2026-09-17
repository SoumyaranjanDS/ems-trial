import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import upgradeRouter from "./routes/upgrade.routes.js";
import eventRoutes from "./routes/event.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

// connect to mongodb
connectDB();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://localhost:5173", "http://10.0.4.85:5173", "https://10.0.4.85:5173"],
    credentials: true,
  }),
);
app.use(json());
app.use(express.urlencoded({ extended: false }));
app.get("/api/health", (req, res) => {
  return res.status(200).json({ message: "Server running successfuly" });
});

app.use("/api/auth", authRoutes);
app.use("/api/upgrade", upgradeRouter);
app.use("/api/event", eventRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/tickets", ticketRoutes);

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
