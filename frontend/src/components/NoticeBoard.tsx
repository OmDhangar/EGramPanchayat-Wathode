import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import BlogSkeleton from "../components/BlogSkeleton";
import BlogEmptyState from "../components/BlogEmptyState";
import { api } from "../api/axios";
import { toast } from "react-hot-toast";
import { FaFilter, FaThumbtack } from "react-icons/fa";

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
  date?: string;
  priority?: "high" | "medium" | "low";
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

// Custom notice board header
const NoticeBoardHeader = () => (
  <div className="text-center mb-8 p-5 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-xl shadow-lg border-b-4 border-purple-800">
    <h1 className="text-3xl font-bold mb-2">सार्वजनिक सूचना फलक</h1>
    <p className="text-blue-100">महानगर पालिका, पुणे</p>
  </div>
);

export default function NoticeBoard() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState("सर्व");

  const fetchBlogs = async (category?: string) => {
    try {
      setLoading(true);
      const url =
        category && category !== "सर्व"
          ? `/blogs?category=${encodeURIComponent(category)}`
          : "/blogs";

      const res = await api.get(url);

      const blogsWithUrls = res.data.map((blog: any) => ({
        ...blog,
        images: blog.images.map((img: any) => ({
          ...img,
          url: img.signedUrl,
        })),
        // Add random dates and priorities for demo
        date: blog.date || new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString('en-IN'),
        priority: blog.priority || ["high", "medium", "low"][Math.floor(Math.random() * 3)]
      }));
      console.log(blogsWithUrls);

      setBlogs(blogsWithUrls);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(selectedCategory);
  }, [selectedCategory]);

  if (loading) return (
    <div className="bg-[#ececff] min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <NoticeBoardHeader />
        <BlogSkeleton />
      </div>
    </div>
  );

  return (
    <div className="bg-[#ececff] min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <NoticeBoardHeader />
        
        {/* Category Filter */}
        <div className="mb-6 bg-white p-5 rounded-xl shadow-md border-l-4 border-purple-500">
          <h3 className="text-base font-semibold mb-3 flex items-center text-gray-700">
            <FaFilter className="mr-2 text-purple-600" /> श्रेणी निवडा
          </h3>
          <div className="flex flex-wrap gap-2">
            {BLOG_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all transform hover:scale-105 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                    : "bg-white text-purple-700 border border-purple-200 hover:bg-purple-50"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div 
                key={blog._id} 
                className="relative transform transition-transform hover:-translate-y-1"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className="absolute -top-2 -left-2 text-purple-600 z-10">
                  <FaThumbtack className="text-2xl rotate-12" />
                </div>
                <div 
                  className="h-full rounded-xl shadow-lg overflow-hidden border-2 border-purple-100 bg-white"
                  style={{
                    transform: 'rotateX(2deg) rotateY(2deg)',
                    boxShadow: '2px 4px 12px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {blog.priority === 'high' && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      महत्वाचे
                    </div>
                  )}
                  <BlogCard blog={blog} />
                  <div className="p-3 bg-purple-50 border-t border-purple-200 text-xs text-purple-700">
                    {blog.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}