import mongoose from "mongoose";

const schemeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, default: "general", trim: true },
    year: { type: Number, required: true, min: 2000, max: 2100 },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    benefits: [{ type: String, trim: true }],
    eligibility: { type: String, trim: true, default: "" },
    applicationProcess: [{ type: String, trim: true }],
    thumbnailPath: { type: String, trim: true, default: "" },
    learnMoreUrl: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator(value) {
          if (!value) return true;
          return /^https?:\/\/.+/i.test(value);
        },
        message: "learnMoreUrl must be a valid URL",
      },
    },
    launchDate: { type: String, trim: true, default: "" },
    agency: { type: String, trim: true, default: "" },
    isPublished: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

schemeSchema.index({ title: 1, year: 1 }, { unique: true });

const Scheme = mongoose.model("Scheme", schemeSchema);

export default Scheme;
