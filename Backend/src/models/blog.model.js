// models/blogModel.ts
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: {
    type: String,
    enum: ["सार्वजनिक सूचना", "जनसेवा", "कर संग्रह", "सण उत्सव", "नियोजन", "शिक्षण"],
    default: "सार्वजनिक सूचना"
  },
  images: [
    {
      s3Key: { type: String, required: true }, 
      folder: {
        type: String,
        enum: ["unverified", "verified", "certificate"],
        default: "unverified",
      },
    },
  ],
}, { timestamps: true });

export default mongoose.model("Blog", blogSchema);
