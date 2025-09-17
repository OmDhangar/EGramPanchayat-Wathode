import { useState, ChangeEvent, FormEvent } from "react";
import {api} from "../api/axios"; // Adjust the import based on your project structure

interface AdminBlogCreateProps {
  onBlogCreated?: () => void; // Optional callback to refresh blog list
}

const AdminBlogCreate: React.FC<AdminBlogCreateProps> = ({ onBlogCreated }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [folder, setFolder] = useState<"unverified" | "verified">("unverified");
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
      alert("Please fill all fields and upload at least one image");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("folder", folder);
    // Make sure we're using 'documents' as the field name for files
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

      alert("Blog created successfully!");
      setTitle("");
      setContent("");
      setImages([]);
      setFolder("unverified");
      if (onBlogCreated) onBlogCreated();
    } catch (err) {
      console.error(err);
      alert("Error creating blog");
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
        value={folder}
        onChange={(e) => setFolder(e.target.value as "unverified" | "verified")}
        className="w-full p-3 border rounded-lg"
      >
        <option value="unverified">Unverified</option>
        <option value="verified">Verified</option>
      </select>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="w-full"
      />
      {images.length > 0 && (
        <p className="text-sm text-gray-500">{images.length} image(s) selected</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {loading ? "Uploading..." : "Create Blog"}
      </button>
    </form>
  );
};

export default AdminBlogCreate;
