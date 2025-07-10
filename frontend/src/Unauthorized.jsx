import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50 p-6">
      <h1 className="text-6xl font-bold text-red-600 mb-6">🚫 Unauthorized</h1>
      <p className="text-lg text-gray-700 mb-6 text-center max-w-md">
        Sorry, you do not have permission to access this page.
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default Unauthorized;