import express from "express";
import { 
  getBlogs, 
  createBlog, 
  updateBlog, 
  deleteBlog, 
  getBlogsByCategory 
} from "../controllers/blog.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Public routes
router.get("/", getBlogs);
router.get("/category/:category", getBlogsByCategory);

// Admin routes
router.post("/", verifyJWT, verifyAdmin, upload.array("documents"), createBlog);
router.put("/:id", verifyJWT, verifyAdmin, updateBlog);
router.delete("/:id", verifyJWT, verifyAdmin, deleteBlog);

export default router;