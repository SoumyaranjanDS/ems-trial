import express from "express";
import upgradeToOrganizer from "../controllers/upgrade.controller.js";

const upgradeRouter = express.Router();

upgradeRouter.put("/organizer" , upgradeToOrganizer)

export default upgradeRouter
