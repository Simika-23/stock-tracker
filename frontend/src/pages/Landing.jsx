import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <section
      id="home"
      className="flex items-center justify-center text-center px-6 bg-white min-h-[calc(100vh-160px)]"
    >
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Track Your Stock <br /> Securely
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto mb-8">
          Monitor your stock portfolio with real-time data<br /> and advanced security features.
        </p>
        <Link
          to="/register"
          className="bg-blue-900 text-white px-6 py-3 rounded text-lg hover:bg-blue-800 transition inline-block"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
};

export default Landing;
