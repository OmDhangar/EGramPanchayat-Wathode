import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../Context/authContext";
import { Scheme, deleteScheme, getAdminSchemes, publishScheme } from "../api/schemes";
import AdminSchemeForm from "../components/AdminSchemeForm";

export default function AdminSchemes() {
  const { isAuthenticated, user } = useAuthContext();
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadSchemes = async () => {
    setLoading(true);
    try {
      const data = await getAdminSchemes();
      setSchemes(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (user?.role !== "admin") {
      navigate("/dashboard");
      return;
    }
    loadSchemes();
  }, [isAuthenticated, user, navigate]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this scheme?")) return;
    await deleteScheme(id);
    await loadSchemes();
  };

  const handlePublishToggle = async (scheme: Scheme) => {
    await publishScheme(scheme._id, !scheme.isPublished);
    await loadSchemes();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Schemes</h1>
        {!showForm && (
          <button
            onClick={() => {
              setEditingScheme(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Scheme
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <AdminSchemeForm
            scheme={editingScheme}
            onSuccess={async () => {
              setShowForm(false);
              setEditingScheme(null);
              await loadSchemes();
            }}
            onCancel={() => {
              setShowForm(false);
              setEditingScheme(null);
            }}
          />
        </div>
      )}

      {loading ? (
        <div className="text-gray-500">Loading schemes...</div>
      ) : schemes.length === 0 ? (
        <div className="text-gray-500">No schemes found.</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-3">Title</th>
                <th className="p-3">Year</th>
                <th className="p-3">Category</th>
                <th className="p-3">Published</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schemes.map((scheme) => (
                <tr key={scheme._id} className="border-b">
                  <td className="p-3">{scheme.title}</td>
                  <td className="p-3">{scheme.year}</td>
                  <td className="p-3">{scheme.category}</td>
                  <td className="p-3">{scheme.isPublished ? "Yes" : "No"}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => {
                        setEditingScheme(scheme);
                        setShowForm(true);
                      }}
                      className="px-2 py-1 bg-amber-500 text-white rounded hover:bg-amber-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handlePublishToggle(scheme)}
                      className="px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      {scheme.isPublished ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() => handleDelete(scheme._id)}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
