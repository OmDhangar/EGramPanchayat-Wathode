import Blog from "../models/blog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getFileDownloadUrl, processUploadedFilesS3 } from "../utils/s3Service.js";

// S3Client and GetObjectCommand are not used here, so I've removed them.

export const getBlogs = asyncHandler(async (req, res) => {
  try {
    const { category } = req.query;

    // --- PAGINATION LOGIC ---
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6; // 6 per page
    const skip = (page - 1) * limit;

    // Build filter
    const filter = category && category !== 'सर्व' ? { category } : {};
    
    // --- GET TOTALS ---
    const totalBlogs = await Blog.countDocuments(filter);
    const totalPages = Math.ceil(totalBlogs / limit);

    // --- FETCH PAGINATED BLOGS ---
    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // --- SIGNED URL LOGIC ---
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

    // --- RETURN PAGINATED RESPONSE ---
    res.status(200).json({
      success: true,
      message: "Blogs retrieved successfully",
      data: {
        blogs: signedBlogs,
        currentPage: page,
        totalPages,
        totalBlogs
      }
    });

  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

export const getBlogById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }

    // Sign images (same logic as in getBlogs)
    const signedImages = await Promise.all(
      blog.images.map(async (img) => {
        const url = await getFileDownloadUrl(img.s3Key, 60 * 60 * 24 * 7); // 7-day signed URL
        return {
          ...img.toObject?.() || img,
          signedUrl: url,
        };
      })
    );

    res.status(200).json({
      ...blog.toObject(),
      images: signedImages,
    });
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    res.status(500).json({ error: "Failed to fetch blog" });
  }
});

export const createBlog = asyncHandler(async (req, res) => { // Added asyncHandler
  try {
    const { title, content, category, folder = "unverified" } = req.body;

    // Upload images to S3 & get keys
    const uploadedFiles = await processUploadedFilesS3(req.files, folder);

    const blog = new Blog({
      title,
      content,
      category,
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


// Get blogs by category

export const getBlogsByCategory = asyncHandler(async (req, res) => {

  const { category } = req.params;

  const blogs = await Blog.find({ category }).sort({ createdAt: -1 });

  res.status(200).json({ success: true, blogs });

});



export const getAllBlogs = asyncHandler(async (req, res) => {

  const blogs = await Blog.find().sort({ createdAt: -1 });

  res.status(200).json({ success: true, blogs });

});







