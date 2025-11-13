import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { api } from "../api/axios";
import { toast } from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface BlogImage {
  s3Key: string;
  folder: "unverified" | "verified" | "certificate";
  signedUrl?: string;
  url?: string;
}

interface Blog {
  _id: string;
  title: string;
  content: string;
  category: string;
  images: BlogImage[];
}

interface AdminBlogCreateProps {
  onBlogCreated?: () => void;
  onBlogUpdated?: () => void;
  blogToEdit?: Blog | null;
  onCancelEdit?: () => void;
}

const BLOG_CATEGORIES = [
  "सार्वजनिक सूचना",
  "जनसेवा",
  "कर संग्रह",
  "सण उत्सव",
  "नियोजन",
  "शिक्षण",
  "योजना",
];

// ReactQuill toolbar and format setup
const modules = {
  toolbar: [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["blockquote", "code-block"],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "color",
  "background",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "indent",
  "align",
  "blockquote",
  "code-block",
  "link",
];

const AdminBlogCreate: React.FC<AdminBlogCreateProps> = ({
  onBlogCreated,
  onBlogUpdated,
  blogToEdit,
  onCancelEdit,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(BLOG_CATEGORIES[0]);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<BlogImage[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const isEditing = !!blogToEdit;

  useEffect(() => {
    if (isEditing && blogToEdit) {
      setTitle(blogToEdit.title);
      setContent(blogToEdit.content);
      setCategory(blogToEdit.category);
      setExistingImages(blogToEdit.images || []);
    } else {
      setTitle("");
      setContent("");
      setCategory(BLOG_CATEGORIES[0]);
      setImages([]);
      setExistingImages([]);
      setRemovedImages([]);
    }
  }, [blogToEdit, isEditing]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleRemoveExistingImage = (s3Key: string) => {
    setRemovedImages((prev) => [...prev, s3Key]);
    setExistingImages((prev) => prev.filter((img) => img.s3Key !== s3Key));
  };

  const clearForm = () => {
    setTitle("");
    setContent("");
    setCategory(BLOG_CATEGORIES[0]);
    setImages([]);
    setExistingImages([]);
    setRemovedImages([]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("कृपया शीर्षक आणि मजकूर भरा");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("removedImages", JSON.stringify(removedImages));

    // ✅ Use "images" — must match backend multer field name
    images.forEach((img) => formData.append("images", img));

    try {
      if (isEditing && blogToEdit) {
        await api.put(`/blogs/${blogToEdit._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("ब्लॉग यशस्वीरित्या अद्यतनित झाला");
        onBlogUpdated?.();
      } else {
        await api.post("/blogs", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("ब्लॉग तयार झाला");
        onBlogCreated?.();
      }

      clearForm();
    } catch (err: any) {
      console.error("Error submitting blog:", err);
      toast.error(err.response?.data?.message || "ब्लॉग सेव्ह करण्यात अडचण आली");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-md p-6 space-y-6 max-w-3xl mx-auto"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">
          {isEditing ? "Edit Blog" : "Create New Blog"}
        </h2>
        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        )}
      </div>

      <input
        type="text"
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 border rounded-lg"
      />

      <div className="bg-white" style={{ minHeight: "250px" }}>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          placeholder="Write your blog content here..."
          style={{ height: "200px" }}
        />
      </div>

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

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            विद्यमान छायाचित्रे (Existing Images)
          </label>
          <div className="flex flex-wrap gap-3">
            {existingImages.map((img) => (
              <div key={img.s3Key} className="relative">
                <img
                  src={img.signedUrl || img.url}
                  alt="Existing"
                  className="h-24 w-24 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(img.s3Key)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 text-xs hover:bg-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload New Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {isEditing ? "Add New Images (Optional)" : "Upload Images (Required)"}
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {images.length > 0 && (
          <p className="text-sm text-gray-500">
            {images.length} image(s) selected
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Saving..." : isEditing ? "Update Blog" : "Create Blog"}
      </button>
    </form>
  );
};

export default AdminBlogCreate;
