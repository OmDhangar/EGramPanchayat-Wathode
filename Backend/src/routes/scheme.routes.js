import express from "express";
import {
  createScheme,
  deleteScheme,
  getAdminSchemes,
  getSchemeByIdOrSlug,
  getSchemes,
  publishScheme,
  updateScheme,
  uploadSchemeThumbnail,
} from "../controllers/scheme.controller.js";
import { verifyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadImages } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.get("/", getSchemes);
router.get("/admin/all", verifyJWT, verifyAdmin, getAdminSchemes);
router.get("/:idOrSlug", getSchemeByIdOrSlug);

router.post("/", verifyJWT, verifyAdmin, createScheme);
router.put("/:id", verifyJWT, verifyAdmin, updateScheme);
router.delete("/:id", verifyJWT, verifyAdmin, deleteScheme);
router.patch("/:id/publish", verifyJWT, verifyAdmin, publishScheme);
router.post(
  "/upload-thumbnail",
  verifyJWT,
  verifyAdmin,
  uploadImages.single("thumbnail"),
  uploadSchemeThumbnail
);

export default router;
