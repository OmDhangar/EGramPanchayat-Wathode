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
  "शिक्षण",
];

// Redesigned Notice Board Header
const NoticeBoardHeader = () => (
  <div className="relative mb-10">
    <div className="mx-auto max-w-3xl">
      <div className="rounded-3xl border border-black bg-white/90 shadow-lg backdrop-blur">
        <div className="px-6 py-8 text-center">
          <h1 className="font-tiro-marathi text-3xl xs:text-4xl font-bold tracking-wide text-indigo-700">
            ✦ सार्वजनिक सूचना फलक ✦
          </h1>
          <p className="mt-3 text-sm xs:text-base text-gray-600">
            ग्रामपंचायतीच्या महत्वाच्या सूचना व अद्ययावत माहिती
          </p>
        </div>
      </div>
    </div>
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
      console.log(res)

      const blogsWithUrls = res.data.map((blog: any) => ({
        ...blog,
        images: blog.images.map((img: any) => ({
          ...img,
          url: img.signedUrl,
        })),
        date:
          blog.date ||
          new Date(
            Date.now() - Math.floor(Math.random() * 10000000000)
          ).toLocaleDateString("en-IN"),
        priority:
          blog.priority ||
          ["high", "medium", "low"][Math.floor(Math.random() * 3)],
      }));

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

  if (loading)
    return (
      <div className="min-h-screen p-6 font-tiro-marathi bg-gradient-to-br from-[#f9f9ff] via-[#f5f6ff] to-[#f1f4ff]">
        <div className="max-w-6xl mx-auto">
          <NoticeBoardHeader />
          <BlogSkeleton />
        </div>
      </div>
    );

  return (
    <div className="min-h-screen p-4 xs:p-6 font-tiro-marathi bg-gradient-to-br from-[#f9f9ff] via-[#f5f6ff] to-[#f1f4ff]">
      <div className="max-w-6xl mx-auto">
        <NoticeBoardHeader />

        {/* Category Filter */}
        <div className="sticky top-2 z-20 mb-6 rounded-2xl bg-white border border-black shadow-sm p-4">
          <h3 className="text-sm xs:text-base font-semibold mb-3 flex items-center text-indigo-700">
            <FaFilter className="mr-2 text-indigo-500" /> श्रेणी निवडा
          </h3>
          <div className="flex flex-wrap gap-2">
            {BLOG_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                aria-pressed={selectedCategory === category}
                className={`px-4 py-2 rounded-full text-xs xs:text-sm whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        {blogs.length === 0 ? (
          <BlogEmptyState />
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="relative group transition-transform hover:-translate-y-1"
              >
                <div className="absolute -top-3 -left-3 text-indigo-500 z-10">
                  <FaThumbtack className="text-2xl rotate-12 drop-shadow" />
                </div>
                <div className="relative h-full rounded-2xl overflow-hidden border border-black bg-white shadow-md hover:shadow-lg transition-all">
                  {/* Priority Tags */}
                  {blog.priority === "high" && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                      महत्वाचे
                    </div>
                  )}
                  {blog.priority === "medium" && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs px-3 py-1 rounded-full">
                      सूचना
                    </div>
                  )}
                  {blog.priority === "low" && (
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs px-3 py-1 rounded-full">
                      सामान्य
                    </div>
                  )}

                  {/* Blog Card */}
                  <BlogCard blog={blog} />

                  {/* Footer */}
                  <div className="p-3 bg-indigo-50 border-t border-black text-xs text-indigo-600">
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
