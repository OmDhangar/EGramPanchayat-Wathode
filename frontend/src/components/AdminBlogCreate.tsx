import { useState, ChangeEvent, FormEvent } from "react";
import {api} from "../api/axios"; // Adjust the import based on your project structure
import { toast } from "react-hot-toast"; // Using toast for better feedback

interface AdminBlogCreateProps {
  onBlogCreated?: () => void; // Optional callback to refresh blog list
}

const BLOG_CATEGORIES = [
  "सार्वजनिक सूचना",
  "जनसेवा",
  "कर संग्रह",
  "सण उत्सव",
  "नियोजन",
  "शिक्षण",
  "योजना"
];

const AdminBlogCreate: React.FC<AdminBlogCreateProps> = ({ onBlogCreated }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(BLOG_CATEGORIES[0]);
  // const [folder, setFolder] = useState<"unverified" | "verified">("unverified"); // Removed folder state
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  // Update the handleSubmit function
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !content || images.length === 0) {
      toast.error("Please fill all fields and upload at least one image");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    // formData.append("folder", folder); // Removed folder from FormData
    
    // Make sure we're using 'documents' as the field name for files
    // Your backend createBlog controller uses req.files, which is correct
    images.forEach((img) => formData.append("documents", img)); 

    try {
      const res = await api.post("/blogs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (res.status !== 201) {
        throw new Error("Failed to create blog");
      }

      toast.success("Blog created successfully!");
      setTitle("");
      setContent("");
      setCategory(BLOG_CATEGORIES[0]);
      setImages([]);
      // setFolder("unverified"); // Removed
      if (onBlogCreated) onBlogCreated();
    } catch (err) {
      console.error(err);
      toast.error("Error creating blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-md p-6 space-y-4 max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4">Create New Blog</h2>

      <input
        type="text"
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 border rounded-lg"
      />

      <textarea
        placeholder="Blog Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-3 border rounded-lg h-40"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-3 border rounded-lg"
      >
        {BLOG_CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="w-full p-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {images.length > 0 && (
        <p className="text-sm text-gray-500">{images.length} image(s) selected</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Create Blog"}
      </button>
    </form>
  );
};

export default AdminBlogCreate;