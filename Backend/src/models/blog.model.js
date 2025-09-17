// models/blogModel.ts
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  images: [
    {
      s3Key: { type: String, required: true }, // "unverified/1234-banner.png"
      folder: {
        type: String,
        enum: ["unverified", "verified", "certificate"],
        default: "unverified",
      },
    },
  ],
});

export default mongoose.model("Blog", blogSchema);
