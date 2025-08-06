import React, { useEffect, useState } from "react";
import { getNotificationsApi, markNotificationAsReadApi } from "../api/Api";
import toast from "react-hot-toast";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const { data } = await getNotificationsApi();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Mark notification as read and update UI
  const markAsRead = async (id) => {
    try {
      await markNotificationAsReadApi(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      toast.success("Marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <div className="bg-white shadow rounded-lg divide-y">
        {notifications.length > 0 ? (
          notifications.map(({ id, message, isRead, createdAt }) => (
            <div
              key={id}
              className={`p-4 flex justify-between items-center ${
                isRead ? "bg-gray-50" : "bg-indigo-50"
              }`}
            >
              <div>
                <p className="text-gray-800">{message}</p>
                <p className="text-xs text-gray-500">
                  {new Date(createdAt).toLocaleString()}
                </p>
              </div>
              {!isRead && (
                <button
                  onClick={() => markAsRead(id)}
                  className="text-sm text-blue-600 hover:underline"
                  aria-label={`Mark notification ${id} as read`}
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="p-4 text-gray-500 text-center">No notifications yet.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
