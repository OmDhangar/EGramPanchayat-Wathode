import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import BlogSkeleton from "../components/BlogSkeleton";
import BlogEmptyState from "../components/BlogEmptyState";
import AdminBlogCreate from "../components/AdminBlogCreate";
import { api } from "../api/axios";
import { toast } from "react-hot-toast";
import { FaPlus, FaFilter } from "react-icons/fa";

import { useAuthContext } from "../Context/authContext";
import { Link } from "react-router-dom";

export interface BlogImage {
  s3Key: string;
  folder: "unverified" | "verified" | "certificate";
  url: string;
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

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("सर्व");
  const { user } = useAuthContext();

  const fetchBlogs = async (category?: string) => {
    try {
      setLoading(true);
      const url = category && category !== "सर्व" 
        ? `/blogs?category=${encodeURIComponent(category)}`
        : "/blogs";
      
      const res = await api.get(url);

      // Map the images to include 'url' for frontend
      const blogsWithUrls = res.data.map((blog: any) => ({
        ...blog,
        images: blog.images.map((img: any) => ({
          ...img,
          url: img.signedUrl,
        })),
      }));

      setBlogs(blogsWithUrls);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(selectedCategory);
  }, [selectedCategory]);

  const handleDelete = async (blogId: string) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await api.delete(`/blogs/${blogId}`);
      toast.success("Blog deleted successfully");
      fetchBlogs(selectedCategory);
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
      fetchBlogs(selectedCategory);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update blog");
    }
  };

  if (loading) return <BlogSkeleton />;

  return (
    <div className="max-w-5xl mx-auto p-6">
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
                onBlogCreated={() => {
                  setShowCreateForm(false);
                  fetchBlogs(selectedCategory);
                }}
              />
            </div>
          )}
        </div>
      )}

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

      {blogs.length === 0 ? (
        <BlogEmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              isAdmin={user?.role === 'admin'}
              onDelete={() => handleDelete(blog._id)}
              onEdit={() => setEditingBlog(blog)}
            />
          ))}
        </div>
      )}
    </div>
  );
}