// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

// const PublicNavbar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <nav
//       role="navigation"
//       aria-label="Main navigation"
//       className="bg-white border-b border-blue-100 shadow-sm fixed top-0 left-0 w-full z-50"
//     >
//       <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex justify-between items-center">
//         {/* Left - Logo pushed left */}
//         <div className="flex-1">
//           <Link
//             to="/"
//             className="text-2xl lg:text-3xl font-extrabold text-indigo-900 tracking-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           >
//             SecureStockTracker
//           </Link>
//         </div>

//         {/* Center - Navigation Links with wide spacing */}
//         <div className="hidden md:flex flex-1 justify-center gap-12 text-blue-800 font-medium">
//           <Link
//             to="/"
//             className="hover:text-indigo-900 transition-colors duration-200 ease-in-out"
//           >
//             Home
//           </Link>
//           <Link
//             to="/features"
//             className="hover:text-indigo-900 transition-colors duration-200 ease-in-out"
//           >
//             Features
//           </Link>
//           <Link
//             to="/contact"
//             className="hover:text-indigo-900 transition-colors duration-200 ease-in-out"
//           >
//             Contact
//           </Link>
//         </div>

//         {/* Right - Auth Buttons pushed right */}
//         <div className="hidden md:flex flex-1 justify-end items-center gap-6">
//           <Link
//             to="/login"
//             className="text-blue-800 font-medium hover:text-indigo-900 transition-colors duration-200"
//           >
//             Login
//           </Link>
//           <Link
//             to="/register"
//             className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white px-5 py-2 rounded-xl font-semibold shadow hover:shadow-lg transition duration-200 ease-in-out"
//           >
//             Register
//           </Link>
//         </div>

//         {/* Mobile Menu Button */}
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           aria-expanded={isOpen}
//           aria-label="Toggle menu"
//           className="md:hidden text-blue-800 hover:text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         >
//           {isOpen ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
//         </button>
//       </div>

//       {/* Mobile Dropdown */}
//       {isOpen && (
//         <div className="md:hidden bg-white border-t border-blue-100 shadow px-6 py-4 space-y-4">
//           <Link
//             to="/"
//             onClick={() => setIsOpen(false)}
//             className="block text-blue-800 font-medium hover:text-indigo-900 transition-colors duration-200"
//           >
//             Home
//           </Link>
//           <Link
//             to="/features"
//             onClick={() => setIsOpen(false)}
//             className="block text-blue-800 font-medium hover:text-indigo-900 transition-colors duration-200"
//           >
//             Features
//           </Link>
//           <Link
//             to="/contact"
//             onClick={() => setIsOpen(false)}
//             className="block text-blue-800 font-medium hover:text-indigo-900 transition-colors duration-200"
//           >
//             Contact
//           </Link>
//           <div className="border-t border-blue-100 pt-4 flex flex-col space-y-3">
//             <Link
//               to="/login"
//               onClick={() => setIsOpen(false)}
//               className="text-blue-800 font-medium hover:text-indigo-900 transition-colors duration-200"
//             >
//               Login
//             </Link>
//             <Link
//               to="/register"
//               onClick={() => setIsOpen(false)}
//               className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white text-center px-5 py-2 rounded-xl font-semibold shadow hover:shadow-lg transition duration-200"
//             >
//               Register
//             </Link>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default PublicNavbar;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className="bg-indigo-50 border-b border-indigo-200 shadow-sm fixed top-0 left-0 w-full z-50"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex justify-between items-center">
        {/* Left - Logo pushed extreme left */}
        <div className="flex-1">
          <Link
            to="/"
            className="text-2xl lg:text-3xl font-extrabold text-indigo-900 tracking-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            SecureStockTracker
          </Link>
        </div>

        {/* Center - Navigation Links with extra extra wide spacing */}
        <div className="hidden md:flex flex-1 justify-center gap-16 text-blue-800 font-medium text-lg">
          <Link
            to="/"
            className="hover:text-indigo-900 transition-colors duration-200 ease-in-out"
          >
            Home
          </Link>
          <Link
            to="/features"
            className="hover:text-indigo-900 transition-colors duration-200 ease-in-out"
          >
            Features
          </Link>
          <Link
            to="/contact"
            className="hover:text-indigo-900 transition-colors duration-200 ease-in-out"
          >
            Contact
          </Link>
        </div>

        {/* Right - Auth Buttons pushed extreme right */}
        <div className="hidden md:flex flex-1 justify-end items-center gap-6">
          <Link
            to="/login"
            className="text-blue-800 font-medium hover:text-indigo-900 transition-colors duration-200"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white px-5 py-2 rounded-xl font-semibold shadow hover:shadow-lg transition duration-200 ease-in-out"
          >
            Register
          </Link>
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
            to="/"
            onClick={() => setIsOpen(false)}
            className="block text-blue-800 font-medium hover:text-indigo-900 transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            to="/features"
            onClick={() => setIsOpen(false)}
            className="block text-blue-800 font-medium hover:text-indigo-900 transition-colors duration-200"
          >
            Features
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="block text-blue-800 font-medium hover:text-indigo-900 transition-colors duration-200"
          >
            Contact
          </Link>
          <div className="border-t border-blue-100 pt-4 flex flex-col space-y-3">
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="text-blue-800 font-medium hover:text-indigo-900 transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white text-center px-5 py-2 rounded-xl font-semibold shadow hover:shadow-lg transition duration-200"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default PublicNavbar;
