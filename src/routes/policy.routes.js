import { Router } from "express";
import { searchPolicyByUsername, aggregatePoliciesByUser } from "../controllers/policy.controller.js";

const router = Router();

router.get("/search", searchPolicyByUsername);

router.get("/aggregate", aggregatePoliciesByUser);

export default router;