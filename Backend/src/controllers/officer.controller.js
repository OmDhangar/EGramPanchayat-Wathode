import { Officer } from "../models/officer.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createOfficer = asyncHandler(async (req, res) => {
  const { name, designation, department, contact } = req.body;
  if (!name || !designation) throw new ApiError(400, "Name and designation are required");

  const officer = await Officer.create({
    name,
    designation,
    department,
    contact,
    image: req.file ? `/uploads/${req.file.filename}` : null,
  });

  res.status(201).json({ success: true, officer });
});

export const getAllOfficers = asyncHandler(async (req, res) => {
  const officers = await Officer.find();
  res.status(200).json({ success: true, officers });
});

export const updateOfficer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  if (req.file) updates.image = `/uploads/${req.file.filename}`;

  const officer = await Officer.findByIdAndUpdate(id, updates, { new: true });
  if (!officer) throw new ApiError(404, "Officer not found");

  res.status(200).json({ success: true, officer });
});

export const deleteOfficer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const officer = await Officer.findByIdAndDelete(id);
  if (!officer) throw new ApiError(404, "Officer not found");

  res.status(200).json({ success: true, message: "Officer deleted successfully" });
});
