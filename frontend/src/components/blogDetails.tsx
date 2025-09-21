import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/axios";
import { toast } from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";

interface BlogImage {
  url: string;
  s3Key: string;
}

interface Blog {
  _id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  priority: string;
  images: BlogImage[];
  createdAt?: string;
  updatedAt?: string;
  author?: string;
}

export default function BlogDetails() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
    try {
      const res = await api.get(`/blogs/${id}`);
      const blogData = {
        ...res.data,
        images: res.data.images?.map((img: any) => ({
          ...img,
          url: img.signedUrl,
        })),
      };
      setBlog(blogData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!blog) {
    return <div className="p-6 text-center">Blog not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link
        to="/blogs"
        className="flex items-center text-blue-600 mb-4 hover:underline"
      >
        <FaArrowLeft className="mr-2" /> Back to Blogs
      </Link>

      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        {blog.category} • {blog.date} • Priority: {blog.priority}
      </p>

      {/* Author + Dates */}
      {blog.author && (
        <p className="text-sm text-gray-600 mb-2">By {blog.author}</p>
      )}
      {blog.createdAt && (
        <p className="text-xs text-gray-400 mb-4">
          Posted on {new Date(blog.createdAt).toLocaleDateString()}
        </p>
      )}

      {/* Images */}
      {blog.images?.length > 0 && (
        <div className="mb-6">
          {blog.images.map((img, idx) => (
            <img
              key={idx}
              src={img.url}
              alt={blog.title}
              className="w-full rounded-lg mb-4"
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="prose max-w-none mb-6">{blog.content}</div>
    </div>
  );
}
