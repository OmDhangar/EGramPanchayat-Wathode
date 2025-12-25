import express from "express";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";
import { uploadMultipleImages } from "../middlewares/multer.middleware.js";
import {
  uploadGalleryImages,
  getGalleryImages,
  deleteGalleryImage,
  deleteMultipleGalleryImages
} from "../controllers/gallery.controller.js";

const router = express.Router();

// Public route - anyone can view gallery images
router.get("/", getGalleryImages);

// Admin routes - require authentication and admin role
router.post(
  "/upload",
  verifyJWT,
  verifyAdmin,
  uploadMultipleImages.array("images", 10), // Allow up to 10 images at once
  uploadGalleryImages
);

router.delete(
  "/:imageKey",
  verifyJWT,
  verifyAdmin,
  deleteGalleryImage
);

router.delete(
  "/batch/delete",
  verifyJWT,
  verifyAdmin,
  deleteMultipleGalleryImages
);

export default router;

