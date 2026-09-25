import { Router } from "express";
import { upload } from "../middleware/upload.js";
import { uploadPolicyFile } from "../controllers/upload.controller.js";

const router = Router();

router.post(
  "/",
  upload.single("file"),
  uploadPolicyFile
);

export default router;