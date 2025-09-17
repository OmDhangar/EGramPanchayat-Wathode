import { Blog } from "../pages/Blogs";
import BlogImageGrid from "./BlogImageGrid";

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-5 border border-slate-100 hover:shadow-md transition">
      <h2 className="text-xl font-semibold mb-3">{blog.title}</h2>
      <p className="text-slate-600 mb-4">{blog.content}</p>
      {blog.images.length > 0 && <BlogImageGrid images={blog.images} />}
    </div>
  );
}
