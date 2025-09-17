import {User} from "../models/user.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import bcrypt from "bcryptjs";

// Fetch all users (Admin only)
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshToken");
  res.status(200).json({
    statusCode: 200,
    data: users,
    message: "Users fetched successfully",
  });
});

// Fetch single user by ID
export const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) throw new ApiError(404, "User not found");

  res.status(200).json({
    statusCode: 200,
    data: user,
    message: "User details fetched successfully",
  });
});

// Update user details (Admin only)
export const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const updateData = { ...req.body };

  // Hash password if admin is updating it
  if (updateData.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(updateData.password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select("-password -refreshToken");

  if (!updatedUser) throw new ApiError(404, "User not found");

  res.status(200).json({
    statusCode: 200,
    data: updatedUser,
    message: "User details updated successfully",
  });
});

// Delete user (Admin only)
export const deleteUserByAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findByIdAndDelete(userId);
  if (!user) throw new ApiError(404, "User not found");

  res.status(200).json({
    statusCode: 200,
    message: "User deleted successfully",
  });
});
