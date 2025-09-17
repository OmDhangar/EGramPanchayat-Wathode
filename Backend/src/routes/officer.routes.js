import express from "express";
import { createOfficer, getAllOfficers, updateOfficer, deleteOfficer } from "../controllers/officer.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.get("/", getAllOfficers);
router.post("/", verifyAdmin, upload.single("image"), createOfficer);
router.put("/:id", verifyAdmin, upload.single("image"), updateOfficer);
router.delete("/:id", verifyAdmin, deleteOfficer);

export default router;
