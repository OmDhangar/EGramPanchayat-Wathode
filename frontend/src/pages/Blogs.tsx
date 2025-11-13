import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import BlogSkeleton from "../components/BlogSkeleton";
import BlogEmptyState from "../components/BlogEmptyState";
import AdminBlogCreate from "../components/AdminBlogCreate";
import { api } from "../api/axios";
import { toast } from "react-hot-toast";
import { FaPlus, FaFilter, FaArrowLeft, FaArrowRight, FaSpinner } from "react-icons/fa"; // Added icons
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../Context/authContext";
import { Helmet } from 'react-helmet';

export interface BlogImage {
  s3Key: string;
  folder: "unverified" | "verified" | "certificate";
  url?: string;
  signedUrl?: string;
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  category: string;
  images: BlogImage[];
}

const BLOG_CATEGORIES = [
  "सर्व",
  "सार्वजनिक सूचना",
  "जनसेवा",
  "कर संग्रह",
  "सण उत्सव",
  "नियोजन",
  "शिक्षण"
];

const BLOGS_PER_PAGE = 6; // 6 blogs per page

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("सर्व");
  const { user } = useAuthContext();
  const navigate =  useNavigate();

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalBlogs, setTotalBlogs] = useState(0);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      
      // --- UPDATED API CALL ---
      const params = {
        page: currentPage,
        limit: BLOGS_PER_PAGE,
        ...(selectedCategory !== "सर्व" && { category: selectedCategory })
      };
      
      const res = await api.get("/blogs", { params });

      console.log('API Response:', res.data); // Debug

      // Correctly extract from res.data.data
      const responseData = res.data.data;

      if (!responseData || !Array.isArray(responseData.blogs)) {
        throw new Error('Invalid response format from server');
      }

      const blogsWithUrls = responseData.blogs.map((blog: any) => ({
        ...blog,
        images: Array.isArray(blog.images) 
          ? blog.images.map((img: any) => ({
              ...img,
              signedUrl: img.signedUrl || '',
              url: img.signedUrl || '',
            }))
          : [],
      }));

      setBlogs(blogsWithUrls);
      setTotalPages(responseData.totalPages);
      setTotalBlogs(responseData.totalBlogs);
      setCurrentPage(responseData.currentPage);

    } catch (err: any) {
      console.error('Error fetching blogs:', err);
      toast.error(err.message || "Failed to fetch blogs");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Refetch when category or page changes
  useEffect(() => {
   if (!editingBlog) {
      fetchBlogs();
    }
  }, [selectedCategory, currentPage,editingBlog]);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const handleDelete = async (blogId: string) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await api.delete(`/blogs/${blogId}`);
      toast.success("Blog deleted successfully");
      // Refetch current page
      // If it was the last item on the page, adjust
      if (blogs.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchBlogs();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete blog");
    }
  };

  const handleUpdate = async (blogId: string, updatedData: Partial<Blog>) => {
    try {
      await api.put(`/blogs/${blogId}`, updatedData);
      toast.success("Blog updated successfully");
      setEditingBlog(null);
      fetchBlogs(); // Refetch current page
    } catch (err) {
      console.error(err);
      toast.error("Failed to update blog");
    }
  };

  // --- PAGINATION HANDLERS ---
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // --- Handlers for the form ---
  const handleShowCreateForm = () => {
    setEditingBlog(null); // Ensure we are not editing
    setShowCreateForm(true);
  }

  const handleEditClick = (blog: Blog) => {
    setEditingBlog(blog); // Set the blog to edit
    setShowCreateForm(true); // Show the form
    window.scrollTo(0, 0); // Scroll to top
  }

  const handleFormCancel = () => {
    setEditingBlog(null);
    setShowCreateForm(false);
  }
  
  const handleFormSuccess = () => {
    setEditingBlog(null);
    setShowCreateForm(false);
  }

  // Show skeleton only on first load
  if (loading && totalBlogs === 0) return <BlogSkeleton />;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Helmet>
        <title>Blogs - Grampanchayat Wathode</title>
        <meta name="description" content="Read the latest news, announcements, and information from Grampanchayat Wathode. Find articles in public notices, public services, tax collection, and other categories." />
      </Helmet>
      
      {/* --- ADMIN CREATE FORM --- */}
      {user?.role === 'admin' && (
        <div className="mb-8">
          {!showCreateForm ? (
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPlus /> Create New Blog
            </button>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create New Blog</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
              <AdminBlogCreate
                blogToEdit={editingBlog}
                onBlogCreated={handleFormSuccess}
                onBlogUpdated={handleFormSuccess}
                onCancelEdit={handleFormCancel}
              />
            </div>
          )}
        </div>
      )}

      {/* --- Hide filters and list when form is open --- */}
      {!showCreateForm && (
        <>
          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <FaFilter className="mr-2" /> श्रेणी निवडा
            </h3>
            <div className="flex flex-wrap gap-2">
              {BLOG_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="relative h-64 flex items-center justify-center">
                <FaSpinner className="animate-spin text-4xl text-blue-600" />
            </div>
          )}

          {!loading && blogs.length === 0 ? (
            <BlogEmptyState />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogs.map((blog) => (
                  <BlogCard
                    key={blog._id}
                    blog={blog}
                    isAdmin={user?.role === 'admin'}
                    onDelete={() => handleDelete(blog._id)}
                    onEdit={() => handleEditClick(blog)} // Pass the blog object up
                    onView={() => navigate(`/blogs/${blog._id}`)}
                  />
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="mt-8 flex justify-between items-center">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage <= 1 || loading}
                    className="inline-flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaArrowLeft />
                    Previous
                  </button>
                  
                  <span className="text-sm text-gray-700">
                    Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                  </span>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages || loading}
                    className="inline-flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <FaArrowRight />
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}