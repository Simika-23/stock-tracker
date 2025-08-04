import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Watchlist", path: "/watchlist" },
];

const PrivateNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLinkClasses = ({ isActive }) =>
    isActive
      ? "text-indigo-900 font-semibold border-b-2 border-indigo-700 transition-colors duration-200 ease-in-out"
      : "text-blue-800 hover:text-indigo-900 transition-colors duration-200 ease-in-out";

  return (
    <nav
      role="navigation"
      aria-label="Private user navigation"
      className="bg-indigo-50 border-b border-indigo-200 shadow-sm fixed top-0 left-0 w-full z-50 min-h-[64px]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center relative">
        {/* Left: Logo */}
        <div className="flex-1">
          <NavLink
            to="/dashboard"
            className="text-2xl lg:text-3xl font-extrabold text-indigo-900 tracking-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            SecureStockTracker
          </NavLink>
        </div>

        {/* Center: Navigation links */}
        <div className="hidden md:flex gap-16 font-medium text-lg absolute left-1/2 -translate-x-1/2">
          {navItems.map(({ name, path }) => (
            <motion.div
              key={name}
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.97 }}
              className="cursor-pointer"
            >
              <NavLink to={path} className={navLinkClasses}>
                {name}
              </NavLink>
            </motion.div>
          ))}
        </div>

        {/* Right: Notifications + Profile */}
        <div className="hidden md:flex justify-end items-center gap-6 min-w-max">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Notifications"
            title="Notifications"
            className="relative group flex items-center justify-center w-10 h-10 rounded-full hover:bg-indigo-100 text-blue-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            onClick={() => navigate("/notifications")}
          >
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-2 right-2 block h-2 w-2 rounded-full ring-1 ring-indigo-50 bg-red-600 opacity-90" />
          </motion.button>

          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={profileOpen}
              aria-label="User menu"
              className="flex items-center gap-1 rounded-full hover:bg-indigo-100 px-3 py-1 text-blue-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            >
              <UserCircleIcon className="h-8 w-8" />
              <ChevronDownIcon
                className={`h-5 w-5 transition-transform ${profileOpen ? "rotate-180" : "rotate-0"
                  }`}
              />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-indigo-200 rounded-md shadow-lg z-50"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                >
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-blue-800 hover:bg-indigo-100 focus:outline-none focus:bg-indigo-100 transition"
                    role="menuitem"
                  >
                    <UserCircleIcon className="h-5 w-5" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/settings");
                    }}
                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-blue-800 hover:bg-indigo-100 focus:outline-none focus:bg-indigo-100 transition"
                    role="menuitem"
                  >
                    <Cog6ToothIcon className="h-5 w-5" />
                    Settings
                  </button>
                  <hr className="border-indigo-200" />
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-red-600 font-semibold hover:bg-red-100 focus:outline-none focus:bg-red-100 transition"
                    role="menuitem"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle menu"
          className="md:hidden text-blue-800 hover:text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {isOpen ? (
            <XMarkIcon className="h-7 w-7" />
          ) : (
            <Bars3Icon className="h-7 w-7" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-blue-100 shadow px-6 py-4 space-y-4">
          {navItems.map(({ name, path }) => (
            <NavLink
              key={name}
              to={path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "block text-indigo-900 font-semibold border-l-4 border-indigo-700 pl-2"
                  : "block text-blue-800 font-medium hover:text-indigo-900 transition-colors duration-200"
              }
            >
              {name}
            </NavLink>
          ))}

          <button
            onClick={() => {
              setIsOpen(false);
              navigate("/notifications");
            }}
            className="flex items-center gap-2 text-blue-800 font-medium hover:text-indigo-900 transition-colors duration-200 focus:outline-none"
          >
            <BellIcon className="h-6 w-6" />
            Notifications
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              navigate("/profile");
            }}
            className="flex items-center gap-2 text-blue-800 font-medium hover:text-indigo-900 transition-colors duration-200 focus:outline-none"
          >
            <UserCircleIcon className="h-6 w-6" />
            Profile
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              navigate("/settings");
            }}
            className="flex items-center gap-2 text-blue-800 font-medium hover:text-indigo-900 transition-colors duration-200 focus:outline-none"
          >
            <Cog6ToothIcon className="h-6 w-6" />
            Settings
          </button>

          <button
            onClick={() => {
              setProfileOpen(false);
              handleLogout();
            }}
            className="w-full text-left px-4 py-2 text-red-600 font-semibold hover:bg-red-100 focus:outline-none focus:bg-red-100 transition flex items-center gap-2"
            role="menuitem"
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6" />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default PrivateNavbar;