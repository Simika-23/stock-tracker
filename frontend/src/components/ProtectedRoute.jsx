import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token");

    if (!token || token === "undefined") {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        // Auto-remove if token expired
        if (decoded.exp && decoded.exp < currentTime) {
            localStorage.removeItem("token");
            return <Navigate to="/login" replace />;
        }

        // Check role access
        if (!allowedRoles || allowedRoles.includes(decoded.role)) {
            return children;
        } else {
            return <Navigate to="/unauthorized" replace />;
        }
    } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;
