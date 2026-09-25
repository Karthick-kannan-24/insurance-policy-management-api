import { Router } from "express";

import {
  scheduleMessage,
} from "../controllers/message.controller.js";

const router = Router();

router.post("/schedule", scheduleMessage);

export default router;