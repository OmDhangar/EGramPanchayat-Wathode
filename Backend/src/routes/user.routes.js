import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUserByAdmin,
  deleteUserByAdmin,
} from "../controllers/user.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin routes
router.use(verifyJWT, verifyAdmin);

router.get("/", getAllUsers);             // GET all users
router.get("/:userId", getUserById);      // GET single user
router.patch("/:userId", updateUserByAdmin); // PATCH update user
router.delete("/:userId", deleteUserByAdmin); // DELETE user

export default router;
