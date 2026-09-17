import express from "express";

import {
  handelUserSignup,
  handelUserLogin,
  handelGetUser,
  handelDeleteUser,
} from "../controllers/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/signup", handelUserSignup);
authRoutes.post("/login", handelUserLogin);
authRoutes.get("/user/:id", handelGetUser);
authRoutes.delete("/user/:id", handelDeleteUser);

export default authRoutes;
