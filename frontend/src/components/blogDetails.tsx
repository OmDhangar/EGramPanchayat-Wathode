import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/axios";
import { toast } from "react-hot-toast";
import { FaArrowLeft, FaTag, FaFlag } from "react-icons/fa";
import { Helmet } from 'react-helmet';

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
    <div className="max-w-4xl mx-auto p-6">
      <Helmet>
        <title>{blog.title} - Grampanchayat Wathode</title>
        <meta name="description" content={blog.content.substring(0, 160) + "..."} />
      </Helmet>
      {/* Back Button */}
      <Link
        to="/"
        className="flex pt-6 items-center text-blue-600 mb-3 hover:underline"
      >
        <FaArrowLeft className="mr-2" /> परत जा
      </Link>

      {/* Card Style */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          {blog.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4 mb-6">
          <span className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            <FaTag className="mr-1" /> {blog.category}
          </span>
        </div>

        {/* Author & Dates */}
        {blog.author && (
          <p className="text-sm text-gray-600 mb-2">लेखक: {blog.author}</p>
        )}
        {blog.createdAt && (
          <p className="text-xs text-gray-500 mb-6">
            Last updated on {new Date(blog.createdAt).toLocaleDateString()}
          </p>
        )}

        {/* Images */}
        {blog.images?.length > 0 && (
          <div className="mb-8 space-y-6">
            {blog.images.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={blog.title}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            ))}
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
          {blog.content}
        </div>
      </div>
    </div>
  );
}
