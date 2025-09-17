import mongoose from "mongoose";

const officerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true }, // e.g., "Police Officer"
    department: { type: String }, // optional
    image: { type: String }, // Cloudinary/S3 URL
    contact: { type: String }, // phone/email
  },
  { timestamps: true }
);

export const Officer = mongoose.model("Officer", officerSchema);
