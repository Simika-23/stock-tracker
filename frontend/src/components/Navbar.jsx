import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-900 text-white shadow-md px-10 py-3 flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
      {/* Logo */}
      <div className="text-2xl font-extrabold tracking-wide">
        <Link to="/">Secure Stock Tracker</Link>
      </div>

      {/* Center Nav Links */}
      <div className="flex gap-30 justify-center font-medium text-white">
        <Link to="/" className="hover:text-gray-200 transition duration-200">Home</Link>
        <Link to="/features" className="hover:text-gray-200 transition duration-200">Features</Link>
        <Link to="/contact" className="hover:text-gray-200 transition duration-200">Contact</Link>
      </div>

      {/* Auth Links */}
      <div className="flex gap-12 items-center">
        <Link to="/login" className="hover:text-gray-200 transition duration-200">Login</Link>
        <Link
          to="/register"
          className="bg-white text-blue-900 font-semibold px-5 py-2 rounded-full hover:bg-gray-100 transition duration-200"
        >
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
