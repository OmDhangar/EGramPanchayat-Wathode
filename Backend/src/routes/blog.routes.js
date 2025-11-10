import express from "express";
import { 
  getBlogs, 
  createBlog, 
  updateBlog, 
  deleteBlog, 
  getBlogsByCategory,
  getBlogById, 
} from "../controllers/blog.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";
import multer from "multer";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getBlogs);
router.get("/category/:category", getBlogsByCategory);
router.get("/:id", getBlogById);

// Admin routes
router.post("/", verifyJWT, verifyAdmin, upload.array("documents"), createBlog);
router.put("/:id", verifyJWT, verifyAdmin,upload.array("documents"), updateBlog);
router.delete("/:id", verifyJWT, verifyAdmin, deleteBlog);

export default router;