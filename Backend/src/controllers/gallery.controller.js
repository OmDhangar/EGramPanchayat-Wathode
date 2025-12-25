import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { 
  uploadToS3, 
  deleteFile, 
  listFilesByFolder,
  getFileDownloadUrl 
} from "../utils/s3Service.js";

/**
 * Upload gallery images to S3 gallery folder
 * POST /api/gallery/upload
 */
export const uploadGalleryImages = asyncHandler(async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new ApiError(400, "No images provided");
    }

    const uploadedImages = [];
    const errors = [];

    // Process each uploaded file
    for (const file of req.files) {
      try {
        // Upload to S3 gallery folder
        const s3Response = await uploadToS3(
          file.path,
          file.originalname,
          'gallery' // Save to gallery folder
        );

        uploadedImages.push({
          key: s3Response.key,
          originalName: s3Response.originalName,
          location: s3Response.location,
          folder: s3Response.folder,
          contentType: s3Response.contentType,
          size: file.size
        });
      } catch (error) {
        console.error(`Error uploading ${file.originalname}:`, error);
        errors.push({
          fileName: file.originalname,
          error: error.message
        });
      }
    }

    if (uploadedImages.length === 0) {
      throw new ApiError(500, "Failed to upload any images", errors);
    }

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          uploaded: uploadedImages,
          errors: errors.length > 0 ? errors : undefined
        },
        `Successfully uploaded ${uploadedImages.length} image(s)`
      )
    );
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Failed to upload gallery images"
    );
  }
});

/**
 * Get all gallery images from gallery folder
 * GET /api/gallery
 */
export const getGalleryImages = asyncHandler(async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 1000;
    
    // List all files from gallery folder
    const files = await listFilesByFolder('gallery', limit);

    // Filter only image files
    const imageFiles = files.filter(file => 
      ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(file.extension?.toLowerCase())
    );

    // Generate signed URLs for each image
    const imagesWithUrls = await Promise.all(
      imageFiles.map(async (file) => {
        try {
          // Generate signed URL valid for 7 days
          const signedUrl = await getFileDownloadUrl(file.key, 60 * 60 * 24 * 7);
          return {
            key: file.key,
            originalName: file.originalName,
            fileName: file.fileName,
            size: file.size,
            lastModified: file.lastModified,
            folder: file.folder,
            extension: file.extension,
            signedUrl: signedUrl,
            downloadUrl: file.downloadUrl
          };
        } catch (error) {
          console.error(`Error generating URL for ${file.key}:`, error);
          return {
            ...file,
            signedUrl: file.downloadUrl, // Fallback to public URL
            error: "Failed to generate signed URL"
          };
        }
      })
    );

    // Sort by last modified (newest first)
    imagesWithUrls.sort((a, b) => 
      new Date(b.lastModified) - new Date(a.lastModified)
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          images: imagesWithUrls,
          total: imagesWithUrls.length
        },
        "Gallery images retrieved successfully"
      )
    );
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Failed to retrieve gallery images"
    );
  }
});

/**
 * Delete gallery image from S3
 * DELETE /api/gallery/:imageKey
 */
export const deleteGalleryImage = asyncHandler(async (req, res) => {
  try {
    let { imageKey } = req.params;

    if (!imageKey) {
      throw new ApiError(400, "Image key is required");
    }

    // Decode URL-encoded image key
    imageKey = decodeURIComponent(imageKey);

    // Verify the image is in the gallery folder (security check)
    if (!imageKey.startsWith('gallery/')) {
      throw new ApiError(403, "Can only delete images from gallery folder");
    }

    // Delete from S3
    await deleteFile(imageKey);

    return res.status(200).json(
      new ApiResponse(
        200,
        { deletedKey: imageKey },
        "Gallery image deleted successfully"
      )
    );
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Failed to delete gallery image"
    );
  }
});

/**
 * Delete multiple gallery images
 * DELETE /api/gallery/batch
 */
export const deleteMultipleGalleryImages = asyncHandler(async (req, res) => {
  try {
    const { imageKeys } = req.body;

    if (!imageKeys || !Array.isArray(imageKeys) || imageKeys.length === 0) {
      throw new ApiError(400, "Image keys array is required");
    }

    const deleted = [];
    const errors = [];

    // Delete each image
    for (const imageKey of imageKeys) {
      try {
        // Verify the image is in the gallery folder
        if (!imageKey.startsWith('gallery/')) {
          errors.push({
            key: imageKey,
            error: "Can only delete images from gallery folder"
          });
          continue;
        }

        await deleteFile(imageKey);
        deleted.push(imageKey);
      } catch (error) {
        console.error(`Error deleting ${imageKey}:`, error);
        errors.push({
          key: imageKey,
          error: error.message
        });
      }
    }

    if (deleted.length === 0) {
      throw new ApiError(500, "Failed to delete any images", errors);
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          deleted: deleted,
          errors: errors.length > 0 ? errors : undefined
        },
        `Successfully deleted ${deleted.length} image(s)`
      )
    );
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Failed to delete gallery images"
    );
  }
});

