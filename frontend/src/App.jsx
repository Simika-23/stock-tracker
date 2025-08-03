import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { Toaster } from 'react-hot-toast'

import PublicNavbar from './components/PublicNavbar'
import PrivateNavbar from './components/PrivateNavbar'

import Landing from './pages/Landing'
import Features from './pages/Features'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Portfolio from './pages/Portfolio'
import ProtectedRoute from './components/ProtectedRoute'
import Unauthorized from './Unauthorized'

// NavbarWrapper: Shows PublicNavbar or PrivateNavbar based on token presence and current route
const NavbarWrapper = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Define routes that are always public (show public navbar)
  const publicPaths = ["/", "/features", "/login", "/register", "/unauthorized"];
  const isPublicPath = publicPaths.includes(location.pathname);

  // Show PublicNavbar if no token or on a public path
  if (!token || isPublicPath) {
    return <PublicNavbar />;
  }

  // Show PrivateNavbar otherwise
  return <PrivateNavbar />;
};

const App = () => {
  return (
   <Router>
    <Toaster/>
    <NavbarWrapper/>
    <Routes>
      <Route path="/" element={<Landing/>}/>
      <Route path="/features" element={<Features/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["user", "admin"]}> <Dashboard/> </ProtectedRoute>}/>
      <Route path="/portfolio" element={<ProtectedRoute allowedRoles={["user"]}> <Portfolio/> </ProtectedRoute>}/>
      <Route path="/unauthorized" element={<Unauthorized/>}/>
    </Routes>
   </Router>
  )
}

export default App
