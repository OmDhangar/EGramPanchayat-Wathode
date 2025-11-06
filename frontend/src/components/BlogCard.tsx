import { useState } from "react";
import { Blog } from "../pages/Blogs"; // Make sure this path is correct
import { FaEdit, FaTrash, FaTag } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import 'quill-better-table/dist/quill-better-table.css';

interface BlogCardProps {
  blog: Blog;
  isAdmin?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  onView?: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  isAdmin = false,
  onDelete,
  onEdit,
  onView
  
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { _id, title, content, category, images } = blog;
  const navigate = useNavigate();

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNavigate = () => {
    // Use onView if provided (like in NoticeBoard), else navigate
    if (onView) {
      onView();
    } else {
      navigate(`/blogs/${_id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow flex flex-col h-full" // Added flex flex-col h-full
      onClick={handleNavigate} // ✅ whole card clickable
    >
      {/* Image carousel */}
      {images && images.length > 0 && (
        <div className="relative h-48">
          <img
            src={images[currentImageIndex]?.url || ""}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full"
              >
                &#10094;
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full"
              >
                &#10095;
              </button>
            </>
          )}
        </div>
      )}

      <div className="p-4 flex flex-col flex-grow"> {/* Added flex flex-col flex-grow */}
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          {isAdmin && (
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                <FaEdit />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                }}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>

        {/* Category tag */}
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <FaTag className="mr-1" />
          <span>{category}</span>
        </div>

        {/* --- UPDATED CONTENT DISPLAY --- */}
        <div
          className="text-gray-700 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: content }} // Render HTML
        />
        
        <div className="mt-auto pt-3"> {/* Pushes button to bottom */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate();
            }}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Read More
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;