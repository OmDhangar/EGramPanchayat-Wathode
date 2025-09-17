import  Blog  from "../models/blog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getFileDownloadUrl,processUploadedFilesS3 } from "../utils/s3Service.js";
import { S3Client } from "@aws-sdk/client-s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();

    const signedBlogs = await Promise.all(
      blogs.map(async (blog) => {
        const signedImages = await Promise.all(
          blog.images.map(async (img) => {
            // Generate 7-day signed URL for each image
            const url = await getFileDownloadUrl(img.s3Key, 60 * 60 * 24 * 7);
            return {
              ...img.toObject?.() || img, // keep folder + s3Key
              signedUrl: url,
            };
          })
        );

        return {
          ...blog.toObject(),
          images: signedImages,
        };
      })
    );

    res.status(200).json(signedBlogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, content, folder = "unverified" } = req.body;

    // Upload images to S3 & get keys
    const uploadedFiles = await processUploadedFilesS3(req.files , folder);

    const blog = new Blog({
      title,
      content,
      images: uploadedFiles.map((file) => ({
        s3Key: file.s3Key,
        folder: file.folder,
      })),
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ error: "Failed to create blog" });
  }
};

export const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, blogs });
});

export const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  if (req.file) updates.image = `/uploads/${req.file.filename}`;

  const blog = await Blog.findByIdAndUpdate(id, updates, { new: true });
  if (!blog) throw new ApiError(404, "Blog not found");

  res.status(200).json({ success: true, blog });
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) throw new ApiError(404, "Blog not found");

  res.status(200).json({ success: true, message: "Blog deleted successfully" });
});
