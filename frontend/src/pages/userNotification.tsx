import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBell, FaSpinner, FaCheck, FaTimes, FaFile } from 'react-icons/fa';
import axios from 'axios';
import { api } from '../api/axios';

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  applicationId?: string;
}

const UserNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          '/notifications',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );
        setNotifications(response.data.data);
      } catch (err) {
        setError('Failed to fetch notifications');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application_submitted':
        return <FaFile className="text-blue-500" />;
      case 'application_approved':
        return <FaCheck className="text-green-500" />;
      case 'application_rejected':
        return <FaTimes className="text-red-500" />;
      case 'certificate_ready':
        return <FaBell className="text-yellow-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <FaSpinner className="animate-spin text-4xl text-blue-600" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 p-8 text-center text-red-600">
      {error}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Notifications</h1>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <motion.div
              key={notification._id}
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {notification.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              No notifications yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserNotifications;