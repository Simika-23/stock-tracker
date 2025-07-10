import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const PrivateNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    // any other cleanup you need
    navigate("/login");
  };

  return (
    <nav
      role="navigation"
      aria-label="Private user navigation"
      className="bg-indigo-50 border-b border-indigo-200 shadow-sm fixed top-0 left-0 w-full z-50"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex justify-between items-center">
        {/* Left - Logo pushed extreme left */}
        <div className="flex-1">
          <Link
            to="/dashboard"
            className="text-2xl lg:text-3xl font-extrabold text-indigo-900 tracking-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            SecureStockTracker
          </Link>
        </div>

        {/* Center - Navigation Links with wide spacing */}
        <div className="hidden md:flex flex-1 justify-center gap-16 text-blue-800 font-medium text-lg">
          <Link
            to="/dashboard"
            className="hover:text-indigo-900 transition-colors duration-200 ease-in-out"
          >
            Dashboard
          </Link>
          <Link
            to="/portfolio"
            className="hover:text-indigo-900 transition-colors duration-200 ease-in-out"
          >
            Portfolio
          </Link>
          <Link
            to="/watchlist"
            className="hover:text-indigo-900 transition-colors duration-200 ease-in-out"
          >
            Watchlist
          </Link>
          <Link
            to="/alerts"
            className="hover:text-indigo-900 transition-colors duration-200 ease-in-out"
          >
            Alerts
          </Link>
          <Link
            to="/profile"
            className="hover:text-indigo-900 transition-colors duration-200 ease-in-out"
          >
            Profile
          </Link>
        </div>

        {/* Right - Logout Button pushed extreme right */}
        <div className="hidden md:flex flex-1 justify-end">
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white px-5 py-2 rounded-xl font-semibold shadow hover:shadow-lg transition duration-200 ease-in-out"
            aria-label="Logout"
          >
            Logout
          </button>
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
          <Link
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className="block text-blue-800 font-medium hover:text-indigo-900 transition-colors duration-200"
          >
            Dashboard
          </Link>
          <Link
            to="/portfolio"
            onClick={() => setIsOpen(false)}
            className="block text-blue-800 font-medium hover:text-indigo-900 transition-colors duration-200"
          >
            Portfolio
          </Link>
          <Link
            to="/watchlist"
            onClick={() => setIsOpen(false)}
            className="block text-blue-800 font-medium hover:text-indigo-900 transition-colors duration-200"
          >
            Watchlist
          </Link>
          <Link
            to="/alerts"
            onClick={() => setIsOpen(false)}
            className="block text-blue-800 font-medium hover:text-indigo-900 transition-colors duration-200"
          >
            Alerts
          </Link>
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="block text-blue-800 font-medium hover:text-indigo-900 transition-colors duration-200"
          >
            Profile
          </Link>

          <div className="border-t border-blue-100 pt-4 flex justify-center">
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white w-full py-2 rounded-xl font-semibold shadow hover:shadow-lg transition duration-200 ease-in-out"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default PrivateNavbar;
