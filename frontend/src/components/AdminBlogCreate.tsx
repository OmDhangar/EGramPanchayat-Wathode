import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { api } from "../api/axios"; 
import { toast } from "react-hot-toast";
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import Quill's snow theme CSS



interface Blog {
  _id: string;
  title: string;
  content: string;
  category: string;
  images: any[];
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
  "योजना"
];

const modules = {
  toolbar: [
    [{ 'font': [] }], // Font family
    [{ 'header': [1, 2, 3, 4, false] }], // Headers
    ['bold', 'italic', 'underline', 'strike'], // Toggled buttons
    [{ 'color': [] }, { 'background': [] }], // Text & background color
    [{ 'align': [] }], // Text alignment
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{ 'indent': '-1'}, { 'indent': '+1' }], // Indent/outdent
    ['blockquote', 'code-block'],
    ['link'],
    ['clean'] // Remove formatting
  ],
};

const formats = [
  'header', 'font', 'color', 'background',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'indent',
  'align', 'blockquote', 'code-block',
  'link',
];

const AdminBlogCreate: React.FC<AdminBlogCreateProps> = ({ 
  onBlogCreated, 
  onBlogUpdated, 
  blogToEdit, 
  onCancelEdit 
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(BLOG_CATEGORIES[0]);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  
  const isEditing = !!blogToEdit;

  useEffect(() => {
    if (isEditing) {
      setTitle(blogToEdit.title);
      setContent(blogToEdit.content);
      setCategory(blogToEdit.category);
    }
  }, [blogToEdit, isEditing]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const clearForm = () => {
    setTitle("");
    setContent("");
    setCategory(BLOG_CATEGORIES[0]);
    setImages([]);
  }

 const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (!title || !content) {
    toast.error("Title and content required");
    return;
  }

  setLoading(true);
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("category", category);

  // Only append new images if user selected any
  if (images.length > 0) {
    images.forEach((img) => formData.append("documents", img));
  }

  // DEBUG
  console.log("Sending FormData:");
  for (const [k, v] of formData.entries()) {
    console.log(k, v instanceof File ? `${v.name} (${v.size} bytes)` : v);
  }

  try {
    let res;
    if (isEditing) {
      res = await api.put(`/blogs/${blogToEdit._id}`, formData);
      toast.success("Blog updated!");
      onBlogUpdated?.();
    } else {
      res = await api.post("/blogs", formData);
      toast.success("Blog created!");
      onBlogCreated?.();
    }
    clearForm();
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Failed to save");
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
        <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit Blog" : "Create New Blog"}</h2>
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

      <div className="bg-white" style={{ minHeight: '250px' }}>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}   // Use the simplified modules
          formats={formats}   // Use the simplified formats
          placeholder="Write your blog content here..."
          style={{ height: '200px' }}
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

      <label className="block text-sm font-medium text-gray-700">
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
        <p className="text-sm text-gray-500">{images.length} image(s) selected</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Saving..." : (isEditing ? "Update Blog" : "Create Blog")}
      </button>
    </form>
  );
};

export default AdminBlogCreate;