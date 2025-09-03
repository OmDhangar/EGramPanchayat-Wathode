import React, { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../api/axios";

type User = {
  _id: string;
  name: string;
  email: string;
  info?: string;
};

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [info, setInfo] = useState("");

  // Fetch all users
  useEffect(() => {
    api.get("/api/users")
      .then(res => {
        // If your API returns { users: [...] }
        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else if (Array.isArray(res.data.users)) {
          setUsers(res.data.users);
        } else {
          setUsers([]);
        }
      })
      .catch(() => setUsers([]));
  }, []);

  // Handle info update
  const handleInfoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setInfo(e.target.value);

  interface HandleSelectUser {
    (user: User): void;
  }

  const handleSelectUser: HandleSelectUser = (user) => {
    setSelectedUser(user);
    setInfo(user.info || "");
  };

  const handleSaveInfo = () => {
    if (!selectedUser) return;
    api.put(`/api/users/${selectedUser._id}`, { info })
      .then(() => {
        setUsers(users.map(u => u._id === selectedUser._id ? { ...u, info } : u));
        alert("User info updated!");
      });
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">User Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{user.name}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                    onClick={() => handleSelectUser(user)}
                  >
                    View / Edit Info
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="mt-6 p-4 bg-gray-100 rounded shadow">
          <h3 className="font-semibold mb-2">Information for {selectedUser.name}</h3>
          <textarea
            className="w-full p-2 border rounded mb-2"
            rows={4}
            value={info}
            onChange={handleInfoChange}
            placeholder="Enter or update user information..."
          />
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleSaveInfo}
          >
            Save Info
          </button>
        </div>
      )}
    </div>
  );
}