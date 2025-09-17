import express from "express";
import { createBlog, getBlogs, updateBlog, deleteBlog } from "../controllers/blog.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.get("/", getBlogs);
router.post("/", verifyAdmin, upload.array("documents"), createBlog);
router.put("/:id", verifyAdmin, upload.single("image"), updateBlog);
router.delete("/:id", verifyAdmin, deleteBlog);

export default router;
