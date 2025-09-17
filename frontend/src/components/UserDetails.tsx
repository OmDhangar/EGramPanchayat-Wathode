import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/axios";

type User = {
  _id: string;
  fullName: string;
  email: string;
  role: "admin" | "client";
  info?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  applicationsSubmitted?: string[];
  applicationsApproved?: string[];
  applicationsRejected?: string[];
  applicationsPending?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export default function UserDetails() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  // Editable fields
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"admin" | "client">("client");
  const [info, setInfo] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!userId) return;

        const res = await api.get(`/admin/users/${userId}`);
        const data: User = res.data.data; // Important: extract from wrapper
        setUser(data);

        // Fill editable fields
        setFullName(data.fullName);
        setRole(data.role);
        setInfo(data.info || "");
      } catch (err) {
        console.error("Error fetching user:", err);
        alert("Failed to fetch user details.");
        navigate("/admin/manage-users");
      }
    };

    fetchUser();
  }, [userId, navigate]);

  const handleSave = async () => {
    if (!user) return;
    try {
      const payload = { fullName, role, info };
      await api.patch(`/admin/users/${user._id}`, payload);
      alert("User updated successfully!");
      navigate("/admin/manage-users");
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user.");
    }
  };

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">User Details</h2>

      {/* Editable Fields */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Full Name</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Role</label>
        <select
          className="w-full p-2 border rounded"
          value={role}
          onChange={(e) => setRole(e.target.value as "admin" | "client")}
        >
          <option value="admin">Admin</option>
          <option value="client">Client</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Info</label>
        <textarea
          className="w-full p-2 border rounded"
          rows={4}
          value={info}
          onChange={(e) => setInfo(e.target.value)}
        />
      </div>

      {/* Read-only Fields */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Email</label>
        <input
          type="email"
          className="w-full p-2 border rounded bg-gray-100"
          value={user.email}
          readOnly
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Email Verified</label>
        <input
          type="text"
          className="w-full p-2 border rounded bg-gray-100"
          value={user.isEmailVerified ? "Yes" : "No"}
          readOnly
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Phone Verified</label>
        <input
          type="text"
          className="w-full p-2 border rounded bg-gray-100"
          value={user.isPhoneVerified ? "Yes" : "No"}
          readOnly
        />
      </div>

      {/* Application summaries */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Applications Summary</h3>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Submitted: {user.applicationsSubmitted?.length || 0}</li>
          <li>Approved: {user.applicationsApproved?.length || 0}</li>
          <li>Rejected: {user.applicationsRejected?.length || 0}</li>
          <li>Pending: {user.applicationsPending?.length || 0}</li>
        </ul>
      </div>

      {/* Timestamps */}
      <div className="mb-4 text-gray-600 text-sm">
        <p>
          Created At:{" "}
          {user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}
        </p>
        <p>
          Last Updated:{" "}
          {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "-"}
        </p>
      </div>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleSave}
      >
        Save Changes
      </button>
    </div>
  );
}
