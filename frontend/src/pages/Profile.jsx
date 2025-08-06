import React, { useEffect, useState } from "react";
import { getCurrentUser, updateUserById } from "../api/Api";
import { motion } from "framer-motion";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getCurrentUser();
        if (data.success) {
          setUser(data.user);
          setFormData({ name: data.user.name, password: "" });
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user?._id) return;
    setUpdating(true);
    setMessage("");

    try {
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      if (formData.password) dataToSend.append("password", formData.password);
      if (profileImage) dataToSend.append("profileImage", profileImage);

      const { data } = await updateUserById(user._id, dataToSend);
      if (data.success) {
        setMessage("Profile updated successfully!");
        setUser(data.updatedUser);
        setProfileImage(null);
        setPreview(null);
        setFormData({ ...formData, password: "" });
      } else {
        setMessage(data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage("Error updating profile.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-28 flex justify-center">
        <p className="text-lg text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="pt-28 max-w-3xl mx-auto px-6">
      <h1 className="text-3xl font-extrabold text-indigo-900 mb-8">
        My Profile
      </h1>

      {message && (
        <p className="mb-4 text-center text-green-600 font-semibold">{message}</p>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
      >
        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <img
              src={preview || user?.profileImage || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-28 h-28 rounded-full border-2 border-indigo-200 object-cover mb-3"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email (read-only)
            </label>
            <input
              type="email"
              value={user?.email}
              disabled
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              New Password (leave blank to keep unchanged)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updating}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {updating ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>

      <div className="mt-6 text-gray-500 text-sm">
        <p>Member since: {new Date(user?.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default Profile;
