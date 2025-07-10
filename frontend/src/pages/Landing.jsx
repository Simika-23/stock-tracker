import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheckIcon,
  ChartBarIcon,
  BellIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  StarIcon,
  CheckIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const SecurityPoint = ({ title, description }) => (
  <div className="flex items-start space-x-3">
    <CheckIcon className="h-6 w-6 text-blue-400 flex-shrink-0 mt-0.5" />
    <div>
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <p className="text-blue-200 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

const Landing = () => {
  return (
    <main className="min-h-screen bg-white pt-20 font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 -z-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20 -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full filter blur-3xl opacity-20 -z-10" />

        <div className="px-6 py-20 lg:py-32 text-center max-w-5xl mx-auto relative">
          {/* Trust Badge */}
          <div className="mb-8 inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 px-4 py-2 rounded-full">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white" />
              <div className="w-6 h-6 bg-indigo-500 rounded-full border-2 border-white" />
              <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Trusted by 10,000+ investors</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Clarity and Security for Your Stock Portfolio
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-2"></span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            A streamlined platform to monitor, manage, and protect your investments.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
            <Link
              to="/register"
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>

          <p className="text-sm text-gray-500 tracking-wide">No commitment • Free to use</p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-snug">
              Built for Smart Investing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Tools to help you track, analyze, and grow your portfolio—securely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: <ShieldCheckIcon className="h-7 w-7" />,
                title: "Bank-Grade Security",
                description:
                  "256-bit encryption, JWT authentication, and multi-factor authentication keep your data safe.",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: <ChartBarIcon className="h-7 w-7" />,
                title: "Advanced Analytics",
                description:
                  "Real-time performance tracking with detailed gain/loss calculations and portfolio insights.",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: <MagnifyingGlassIcon className="h-7 w-7" />,
                title: "Market Intelligence",
                description:
                  "Live market data, sentiment analysis, and comprehensive stock research tools.",
                gradient: "from-orange-500 to-red-500",
              },
              {
                icon: <StarIcon className="h-7 w-7" />,
                title: "Smart Watchlists",
                description:
                  "Create custom watchlists with real-time updates and one-click portfolio additions.",
                gradient: "from-green-500 to-teal-500",
              },
              {
                icon: <BellIcon className="h-7 w-7" />,
                title: "Price Alerts",
                description:
                  "Set custom price targets and receive instant notifications across all devices.",
                gradient: "from-indigo-500 to-purple-500",
              },
              {
                icon: <LockClosedIcon className="h-7 w-7" />,
                title: "Private & Secure",
                description: "Your data is encrypted end-to-end with zero access to third parties.",
                gradient: "from-gray-600 to-gray-800",
              },
            ].map(({ icon, title, description, gradient }) => (
              <article
                key={title}
                className="group bg-white p-10 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 cursor-pointer"
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900" />
        <div
          className="absolute inset-0 bg-[url(data:image/svg+xml,%3Csvg%20width='60'%20height='60'%20viewBox='0%200%2060%2060'%20xmlns='http://www.w3.org/2000/svg'%3E%3Cg%20fill='none'%20fill-rule='evenodd'%3E%3Cg%20fill='%239C92AC'%20fill-opacity='0.05'%3E%3Cpath%20d='M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E)] opacity-20"
        />

        <div className="relative px-6 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-6">
              <ShieldCheckIcon className="h-8 w-8 text-blue-400" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 leading-snug">Security You Can Trust</h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto leading-relaxed">
              We take security seriously so you can focus on what matters - growing your portfolio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <SecurityPoint
              title="End-to-End Encryption"
              description="All data is encrypted in transit and at rest using AES-256 encryption"
            />
            <SecurityPoint
              title="Secure Authentication"
              description="JWT tokens with automatic refresh and session management"
            />
            <SecurityPoint
              title="API Protection"
              description="Rate limiting, CORS protection, and request validation"
            />
            <SecurityPoint
              title="Regular Security Audits"
              description="Third-party penetration testing and vulnerability assessments"
            />
            <SecurityPoint
              title="Data Privacy"
              description="GDPR compliant with full data ownership and deletion rights"
            />
            <SecurityPoint
              title="99.9% Uptime"
              description="Redundant infrastructure with automatic failover"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative px-6 text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6 leading-snug">Ready to Take Control of Your Portfolio?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of investors who trust our platform for secure, professional portfolio management.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/register"
              className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/demo"
              className="bg-transparent text-white px-8 py-4 rounded-xl font-semibold border-2 border-white/30 hover:bg-white/10 hover:border-white/50 transition-all duration-200"
            >
              View Live Demo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Landing;
