import fs from "fs";
import path from "path";
import Scheme from "../models/scheme.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toSlug = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const ensureUniqueSlug = async (baseSlug, ignoreId = null) => {
  let candidate = baseSlug;
  let counter = 2;
  while (true) {
    const existing = await Scheme.findOne({ slug: candidate });
    if (!existing || (ignoreId && existing._id.toString() === ignoreId.toString())) {
      return candidate;
    }
    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }
};

const parseList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      return value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [];
};

export const getSchemes = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const requestedLimit = Math.max(parseInt(req.query.limit || "20", 10), 1);
  const limit = Math.min(requestedLimit, 100);
  const skip = (page - 1) * limit;
  const filter = {};

  if (req.query.year) filter.year = Number(req.query.year);
  if (req.query.category) filter.category = req.query.category;
  if (req.query.isPublished !== undefined) filter.isPublished = req.query.isPublished === "true";
  else filter.isPublished = true;

  const [schemes, total] = await Promise.all([
    Scheme.find(filter).sort({ year: -1, displayOrder: 1, createdAt: -1 }).skip(skip).limit(limit),
    Scheme.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      schemes,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    }, "Schemes fetched successfully")
  );
});

export const getAdminSchemes = asyncHandler(async (req, res) => {
  const schemes = await Scheme.find({}).sort({ year: -1, displayOrder: 1, createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, { schemes }, "Admin schemes fetched successfully"));
});

export const getSchemeByIdOrSlug = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const selector = idOrSlug.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: idOrSlug }
    : { slug: idOrSlug };

  const scheme = await Scheme.findOne(selector);
  if (!scheme) {
    throw new ApiError(404, "Scheme not found");
  }

  return res.status(200).json(new ApiResponse(200, scheme, "Scheme fetched successfully"));
});

export const createScheme = asyncHandler(async (req, res) => {
  const {
    title,
    slug,
    description,
    category,
    year,
    status,
    eligibility,
    learnMoreUrl,
    launchDate,
    agency,
    isPublished,
    displayOrder,
    thumbnailPath,
  } = req.body;

  if (!title || !description || !year) {
    throw new ApiError(400, "title, description and year are required");
  }

  const baseSlug = toSlug(slug || title);
  if (!baseSlug) throw new ApiError(400, "Valid slug could not be generated");
  const uniqueSlug = await ensureUniqueSlug(baseSlug);

  const created = await Scheme.create({
    title,
    slug: uniqueSlug,
    description,
    category: category || "general",
    year: Number(year),
    status: status || "active",
    eligibility: eligibility || "",
    learnMoreUrl: learnMoreUrl || "",
    launchDate: launchDate || "",
    agency: agency || "",
    isPublished: isPublished === "true" || isPublished === true,
    displayOrder: Number(displayOrder || 0),
    thumbnailPath: thumbnailPath || "",
    benefits: parseList(req.body.benefits),
    applicationProcess: parseList(req.body.applicationProcess),
  });

  return res.status(201).json(new ApiResponse(201, created, "Scheme created successfully"));
});

export const updateScheme = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const scheme = await Scheme.findById(id);
  if (!scheme) throw new ApiError(404, "Scheme not found");

  if (req.body.title !== undefined) scheme.title = req.body.title;
  if (req.body.description !== undefined) scheme.description = req.body.description;
  if (req.body.category !== undefined) scheme.category = req.body.category;
  if (req.body.year !== undefined) scheme.year = Number(req.body.year);
  if (req.body.status !== undefined) scheme.status = req.body.status;
  if (req.body.eligibility !== undefined) scheme.eligibility = req.body.eligibility;
  if (req.body.learnMoreUrl !== undefined) scheme.learnMoreUrl = req.body.learnMoreUrl;
  if (req.body.launchDate !== undefined) scheme.launchDate = req.body.launchDate;
  if (req.body.agency !== undefined) scheme.agency = req.body.agency;
  if (req.body.displayOrder !== undefined) scheme.displayOrder = Number(req.body.displayOrder || 0);
  if (req.body.thumbnailPath !== undefined) scheme.thumbnailPath = req.body.thumbnailPath;
  if (req.body.isPublished !== undefined) {
    scheme.isPublished = req.body.isPublished === "true" || req.body.isPublished === true;
  }
  if (req.body.benefits !== undefined) scheme.benefits = parseList(req.body.benefits);
  if (req.body.applicationProcess !== undefined) scheme.applicationProcess = parseList(req.body.applicationProcess);

  if (req.body.slug !== undefined || req.body.title !== undefined) {
    const baseSlug = toSlug(req.body.slug || scheme.title);
    scheme.slug = await ensureUniqueSlug(baseSlug, scheme._id);
  }

  await scheme.save();
  return res.status(200).json(new ApiResponse(200, scheme, "Scheme updated successfully"));
});

export const deleteScheme = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const scheme = await Scheme.findByIdAndDelete(id);
  if (!scheme) throw new ApiError(404, "Scheme not found");
  return res.status(200).json(new ApiResponse(200, {}, "Scheme deleted successfully"));
});

export const publishScheme = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const scheme = await Scheme.findById(id);
  if (!scheme) throw new ApiError(404, "Scheme not found");

  scheme.isPublished = req.body.isPublished === true || req.body.isPublished === "true";
  await scheme.save();
  return res.status(200).json(new ApiResponse(200, scheme, "Scheme publish status updated"));
});

export const uploadSchemeThumbnail = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Thumbnail image is required");
  }

  const uploadDir = path.resolve(process.cwd(), "public", "uploads", "schemes");
  fs.mkdirSync(uploadDir, { recursive: true });

  const extension = path.extname(req.file.originalname || "") || ".jpg";
  const fileName = `scheme-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
  const destinationPath = path.join(uploadDir, fileName);

  fs.renameSync(req.file.path, destinationPath);
  const thumbnailPath = `/uploads/schemes/${fileName}`;

  return res.status(200).json(
    new ApiResponse(200, { thumbnailPath }, "Thumbnail uploaded successfully")
  );
});
