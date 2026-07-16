import { Router } from "express";
import {getAllAlerts, getAlertById, createAlert, updateAlert, deleteAlert} from "../controllers/alerts.controller.js"

const router = Router();

router.get("/", getAllAlerts);
router.get("/:id", getAlertById);
router.post("/", createAlert);
router.put("/:id", updateAlert);
router.delete("/:id", deleteAlert);

export default router;