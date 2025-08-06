import React, { useState } from "react";

const Settings = () => {
  // Example states for form inputs
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationsChange = (e) => {
    const { name, checked } = e.target;
    setNotifications((prev) => ({ ...prev, [name]: checked }));
  };

  const handlePasswordsChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // TODO: add validation & submit logic
    alert("Profile updated!");
  };

  const handleNotificationsSubmit = (e) => {
    e.preventDefault();
    // TODO: add submit logic
    alert("Notification settings saved!");
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    // TODO: add password change logic
    alert("Password changed successfully!");
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <main className="max-w-4xl mx-auto p-6 pt-24 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Settings</h1>

      {/* Profile Section */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-800">Profile Information</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="block mb-1 font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={profile.fullName}
              onChange={handleProfileChange}
              required
              className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-1 font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleProfileChange}
              required
              className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500"
              placeholder="your.email@example.com"
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-semibold transition"
          >
            Update Profile
          </button>
        </form>
      </section>

      {/* Notifications Section */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-800">Notifications</h2>
        <form onSubmit={handleNotificationsSubmit} className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="emailAlerts"
              name="emailAlerts"
              checked={notifications.emailAlerts}
              onChange={handleNotificationsChange}
              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="emailAlerts" className="font-medium text-gray-700">
              Email Alerts
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="smsAlerts"
              name="smsAlerts"
              checked={notifications.smsAlerts}
              onChange={handleNotificationsChange}
              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="smsAlerts" className="font-medium text-gray-700">
              SMS Alerts
            </label>
          </div>

          <button
            type="submit"
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-semibold transition"
          >
            Save Notifications
          </button>
        </form>
      </section>

      {/* Change Password Section */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-800">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="block mb-1 font-medium text-gray-700"
            >
              Current Password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={passwords.currentPassword}
              onChange={handlePasswordsChange}
              required
              className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block mb-1 font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={passwords.newPassword}
              onChange={handlePasswordsChange}
              required
              className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-1 font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={passwords.confirmPassword}
              onChange={handlePasswordsChange}
              required
              className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-semibold transition"
          >
            Change Password
          </button>
        </form>
      </section>
    </main>
  );
};

export default Settings;
