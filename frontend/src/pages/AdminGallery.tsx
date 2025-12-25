import React, { useEffect, useState, useRef } from "react";
import { api } from "../api/axios";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUpload,
  FaTrash,
  FaImage,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useAuthContext } from "../Context/authContext";
import { useNavigate } from "react-router-dom";

interface GalleryImage {
  key: string;
  originalName: string;
  fileName: string;
  size: number;
  lastModified: string;
  folder: string;
  extension: string;
  signedUrl: string;
  downloadUrl: string;
}

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("Access denied. Admin privileges required.");
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Fetch gallery images
  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const res = await api.get("/gallery");
      const responseData = res.data.data;
      
      if (responseData && Array.isArray(responseData.images)) {
        setImages(responseData.images);
      } else {
        setImages([]);
      }
    } catch (err: any) {
      console.error("Error fetching gallery images:", err);
      toast.error(err.message || "Failed to fetch gallery images");
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate file types
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    const invalidFiles: string[] = [];

    Array.from(files).forEach((file) => {
      if (!validTypes.includes(file.type)) {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      toast.error(
        `Invalid file types: ${invalidFiles.join(", ")}. Only JPG and PNG are allowed.`
      );
      return;
    }

    // Upload files
    handleUpload(files);
  };

  // Handle image upload
  const handleUpload = async (files: FileList) => {
    try {
      setUploading(true);
      const formData = new FormData();

      Array.from(files).forEach((file) => {
        formData.append("images", file);
      });

      const res = await api.post("/gallery/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(
        res.data.message || `Successfully uploaded ${files.length} image(s)`
      );

      // Refresh gallery
      await fetchGalleryImages();

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      console.error("Error uploading images:", err);
      toast.error(err.message || "Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  // Handle single image delete
  const handleDelete = async (imageKey: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this image? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeleteLoading(imageKey);
      // URL encode the image key
      const encodedKey = encodeURIComponent(imageKey);
      await api.delete(`/gallery/${encodedKey}`);

      toast.success("Image deleted successfully");
      await fetchGalleryImages();
      setSelectedImages(new Set());
    } catch (err: any) {
      console.error("Error deleting image:", err);
      toast.error(err.message || "Failed to delete image");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Handle multiple image delete
  const handleDeleteMultiple = async () => {
    if (selectedImages.size === 0) {
      toast.error("Please select images to delete");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedImages.size} image(s)? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setDeleteLoading("multiple");
      const imageKeys = Array.from(selectedImages);
      await api.delete("/gallery/batch/delete", {
        data: { imageKeys },
      });

      toast.success(`Successfully deleted ${imageKeys.length} image(s)`);
      await fetchGalleryImages();
      setSelectedImages(new Set());
    } catch (err: any) {
      console.error("Error deleting images:", err);
      toast.error(err.message || "Failed to delete images");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Toggle image selection
  const toggleImageSelection = (imageKey: string) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(imageKey)) {
      newSelected.delete(imageKey);
    } else {
      newSelected.add(imageKey);
    }
    setSelectedImages(newSelected);
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading gallery images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 md:p-6 lg:p-8">
      <Helmet>
        <title>Gallery Management - ग्रामपंचायत वाठोडे</title>
        <meta
          name="description"
          content="Manage gallery images for Gram Panchayat Wathode website"
        />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Gallery Management
              </h1>
              <p className="text-gray-600">
                Upload and manage gallery images. Images are stored in the
                gallery folder on S3.
              </p>
            </div>
            <div className="flex gap-3">
              {selectedImages.size > 0 && (
                <button
                  onClick={handleDeleteMultiple}
                  disabled={deleteLoading === "multiple"}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  {deleteLoading === "multiple" ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaTrash />
                  )}
                  Delete Selected ({selectedImages.size})
                </button>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                {uploading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaUpload />
                )}
                {uploading ? "Uploading..." : "Upload Images"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaImage className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Images</p>
                <p className="text-2xl font-bold text-gray-800">
                  {images.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Selected</p>
                <p className="text-2xl font-bold text-gray-800">
                  {selectedImages.size}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaImage className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Storage</p>
                <p className="text-2xl font-bold text-gray-800">S3 Gallery</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Gallery Grid */}
        {images.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center"
          >
            <FaImage className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Images Found
            </h3>
            <p className="text-gray-500 mb-6">
              Upload your first image to get started
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <FaUpload />
              Upload Images
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            <AnimatePresence>
              {images.map((image) => (
                <motion.div
                  key={image.key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow relative group"
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={selectedImages.has(image.key)}
                      onChange={() => toggleImageSelection(image.key)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  </div>

                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={image.signedUrl || image.downloadUrl}
                      alt={image.originalName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/400x400?text=Image+Error";
                      }}
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button
                          onClick={() => handleDelete(image.key)}
                          disabled={deleteLoading === image.key}
                          className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Delete image"
                        >
                          {deleteLoading === image.key ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Image Info */}
                  <div className="p-3">
                    <p
                      className="text-sm font-medium text-gray-800 truncate mb-1"
                      title={image.originalName}
                    >
                      {image.originalName}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatFileSize(image.size)}</span>
                      <span>{formatDate(image.lastModified)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

