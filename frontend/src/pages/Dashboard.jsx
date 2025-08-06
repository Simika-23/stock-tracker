import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getCurrentUser,
  getPortfolioApi,
  getWatchlistApi,
  getAlertsApi,
  getNewsSentimentApi,
} from "../api/Api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CountUp from "react-countup";
import clsx from "clsx";

const formatCurrency = (val) =>
  `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
const formatPercentage = (val) => `${Number(val).toFixed(2)}%`;

const LiveRegion = ({ message }) => (
  <div aria-live="polite" aria-atomic="true" className="sr-only" tabIndex={-1}>
    {message}
  </div>
);

const WelcomeOverlay = ({ username }) => (
  <AnimatePresence>
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-50/90 backdrop-blur-sm"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.7 } }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      aria-live="polite"
      role="alertdialog"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="bg-white rounded-3xl shadow-2xl px-14 py-16 flex flex-col items-center max-w-md text-center font-sans"
      >
        <motion.h1
          className="text-3xl font-semibold text-indigo-900 mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          Welcome, <span className="text-indigo-600">{username}</span>!
        </motion.h1>
        <motion.p
          className="text-base text-gray-700 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Loading your dashboard...
        </motion.p>
        <motion.div
          className="w-28 h-4 rounded-full bg-indigo-100 overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2 }}
        >
          <motion.div
            className="h-4 bg-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2 }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

const Section = ({ children, className = "" }) => (
  <section className={clsx("mb-12", className)}>{children}</section>
);

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveMessage, setLiveMessage] = useState("");
  const prevPortfolioValue = useRef(0);
  const [showWelcome, setShowWelcome] = useState(false);

  // Fetch dashboard data
  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [userRes, portfolioRes, watchlistRes, alertsRes] = await Promise.all([
        getCurrentUser(),
        getPortfolioApi(),
        getWatchlistApi(),
        getAlertsApi(),
      ]);

      setUser(userRes.data);
      setPortfolio(portfolioRes.data.data || []);
      setWatchlist(watchlistRes.data.data || []);
      setAlerts(alertsRes.data.data || []);

      const combinedSymbols = [
        ...new Set([
          ...portfolioRes.data.data.map((p) => p.symbol),
          ...watchlistRes.data.data.map((w) => w.symbol),
        ]),
      ].slice(0, 5);

      const newsResults = await Promise.all(
        combinedSymbols.map(async (symbol) => {
          try {
            const res = await getNewsSentimentApi(symbol);
            return {
              symbol,
              news: res.data.data.topHeadlines || [],
              sentiment: res.data.data.sentiment || "Neutral",
            };
          } catch {
            return { symbol, news: [], sentiment: "Neutral" };
          }
        })
      );

      setNews(newsResults);
    } catch {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 5 * 60 * 1000); // refresh every 5 mins
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const welcomeShown = localStorage.getItem("welcomeShown");
    if (user && !welcomeShown) {
      setShowWelcome(true);
      const timer = setTimeout(() => {
        setShowWelcome(false);
        localStorage.setItem("welcomeShown", "true");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Calculate portfolio summary
  const totalValue = portfolio.reduce(
    (sum, item) => sum + (parseFloat(item.live?.price || item.currentPrice || 0)) * item.quantity,
    0
  );
  const prevCloseValue = portfolio.reduce(
    (sum, item) =>
      sum +
      ((parseFloat(item.live?.prevClosePrice) || parseFloat(item.live?.price) || 0) * item.quantity),
    0
  );
  const dailyChange = totalValue - prevCloseValue;
  const dailyChangePct = prevCloseValue
    ? ((dailyChange / prevCloseValue) * 100).toFixed(2)
    : "0.00";

  useEffect(() => {
    if (!loading && prevPortfolioValue.current !== totalValue) {
      setLiveMessage(
        `Portfolio value updated: ${formatCurrency(totalValue)}. Daily change: ${formatCurrency(
          dailyChange
        )} (${formatPercentage(dailyChangePct)})`
      );
      prevPortfolioValue.current = totalValue;
    }
  }, [totalValue, dailyChange, dailyChangePct, loading]);

  // Prepare data for portfolio value chart
  // Use history data if available, else create dummy for last 7 days
  const chartData =
    portfolio.length && portfolio[0].history
      ? portfolio[0].history.map((point, idx) => ({
          date: point.date,
          value: portfolio.reduce(
            (sum, item) =>
              sum + ((item.history?.[idx]?.price || item.live?.price || 0) * item.quantity),
            0
          ),
        }))
      : Array.from({ length: 7 }, (_, i) => ({
          date: `Day ${i + 1}`,
          value: totalValue * (1 - 0.03 + Math.random() * 0.06),
        }));

  if (loading) {
    return (
      <main className="pt-20 p-4 max-w-6xl mx-auto font-sans">
        <Skeleton height={56} width={360} />
        <div className="flex flex-col lg:flex-row gap-8 mt-10">
          <Skeleton height={320} width="100%" className="flex-1 rounded-3xl" />
          <div className="flex flex-col gap-6 w-full max-w-md">
            <Skeleton height={160} className="rounded-3xl" />
            <Skeleton height={160} className="rounded-3xl" />
          </div>
        </div>
        <Skeleton height={320} className="mt-14 rounded-3xl" />
        <Skeleton height={70} className="mt-10 rounded-xl max-w-md" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-20 p-4 max-w-6xl mx-auto text-center font-sans" role="alert">
        <p className="text-red-700 font-semibold text-lg">{error}</p>
        <button
          onClick={fetchAll}
          className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Retry
        </button>
      </main>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 font-sans">
      {user && showWelcome && <WelcomeOverlay username={user.userName || "Investor"} />}

      <main
        className={clsx(
          "transition-all duration-700 pt-20 max-w-6xl mx-auto px-4",
          showWelcome && "pointer-events-none filter blur-sm brightness-90"
        )}
        aria-hidden={showWelcome}
      >
        <LiveRegion message={liveMessage} />

        <Section className="flex flex-col lg:flex-row gap-12">
          {/* Portfolio Summary Card */}
          <motion.div
            whileHover={{ scale: 1.03, boxShadow: "0 12px 40px rgba(99, 102, 241, 0.2)" }}
            className="flex-1 bg-white rounded-3xl p-8 border border-gray-200 shadow"
            tabIndex={0}
            aria-label={`Total portfolio value is ${formatCurrency(totalValue)}. Daily change is ${formatCurrency(
              dailyChange
            )} or ${formatPercentage(dailyChangePct)}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-10 bg-indigo-600 rounded-full" />
              <h2 className="text-3xl font-semibold text-indigo-900">Portfolio Value</h2>
            </div>
            <div className="text-6xl font-extrabold text-indigo-800 mb-5" aria-live="polite">
              <CountUp end={totalValue} duration={1.5} prefix="$" separator="," decimals={2} />
            </div>
            <div
              className={clsx(
                "text-2xl font-semibold flex items-center gap-3",
                dailyChange >= 0 ? "text-green-600" : "text-red-600"
              )}
            >
              {dailyChange >= 0 ? "+" : ""}
              <CountUp end={dailyChange} duration={1.5} prefix="$" separator="," decimals={2} />
              <span className="text-lg">{formatPercentage(dailyChangePct)}</span>
            </div>
            <div className="mt-6 h-24">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip formatter={formatCurrency} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={false}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <Link
              to="/portfolio"
              className="mt-8 inline-block text-indigo-600 hover:underline font-semibold focus:outline-none focus:ring-2 ring-indigo-400 transition"
            >
              View Portfolio →
            </Link>
          </motion.div>

          {/* Watchlist & Alerts Cards */}
          <div className="flex flex-col gap-8 w-full max-w-md">
            <motion.div
              whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(16,185,129,0.15)" }}
              className="bg-white rounded-3xl p-6 border border-gray-200 shadow"
              tabIndex={0}
              aria-label={`You have ${watchlist.length} stocks in your watchlist.`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-10 bg-green-600 rounded-full" />
                <h2 className="text-2xl font-semibold text-green-900">Watchlist</h2>
              </div>
              {watchlist.length ? (
                <ul className="divide-y divide-gray-200 max-h-56 overflow-y-auto font-mono text-gray-800">
                  {watchlist.slice(0, 5).map((stock) => (
                    <li key={stock.symbol} className="flex justify-between py-2">
                      <span>{stock.symbol}</span>
                      <span
                        className={
                          stock.changePercent >= 0 ? "text-green-600" : "text-red-600"
                        }
                      >
                        {formatCurrency(stock.currentPrice)} ({formatPercentage(stock.changePercent)})
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 italic">No stocks in watchlist</p>
              )}
              <Link
                to="/watchlist"
                className="mt-5 inline-block text-green-600 hover:underline font-semibold focus:outline-none focus:ring-2 ring-green-400 transition"
              >
                View All →
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(251,191,36,0.15)" }}
              className="bg-white rounded-3xl p-6 border border-gray-200 shadow"
              tabIndex={0}
              aria-label={`You have ${alerts.filter((a) => a.isActive).length} active price alerts.`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-10 bg-amber-400 rounded-full" />
                <h2 className="text-2xl font-semibold text-amber-700">Price Alerts</h2>
              </div>
              <p className="text-gray-800 font-semibold">
                Active Alerts: <span>{alerts.filter((a) => a.isActive).length}</span>
              </p>
              {alerts.length > 0 && (
                <p className="mt-3 text-gray-600 text-sm">
                  Last Triggered:{" "}
                  <strong>{alerts[alerts.length - 1].symbol}</strong> at{" "}
                  <strong>{formatCurrency(alerts[alerts.length - 1].triggerPrice)}</strong>
                </p>
              )}
              <Link
                to="/alerts"
                className="mt-5 inline-block text-amber-600 hover:underline font-semibold focus:outline-none focus:ring-2 ring-amber-300 transition"
              >
                Manage Alerts →
              </Link>
            </motion.div>
          </div>
        </Section>

        {/* Market Sentiment / News Section */}
        <Section>
          <motion.div
            whileHover={{ scale: 1.02, boxShadow: "0 8px 32px rgba(236,72,153,0.15)" }}
            className="bg-white rounded-3xl p-8 border border-gray-200 shadow"
            tabIndex={0}
            aria-label="Latest market news"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-10 bg-pink-600 rounded-full" />
              <h2 className="text-3xl font-semibold text-pink-900">Market News & Sentiment</h2>
            </div>
            {news.length ? (
              news.map((n, idx) => (
                <div key={idx} className="mb-6 border-b border-gray-200 pb-4 font-sans">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="font-mono font-bold text-lg">{n.symbol}</span>
                    {n.sentiment && (
                      <span
                        className={clsx(
                          "text-xs font-semibold px-3 py-1 rounded-full select-none",
                          n.sentiment === "Bullish"
                            ? "bg-green-100 text-green-700"
                            : n.sentiment === "Bearish"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        )}
                      >
                        {n.sentiment}
                      </span>
                    )}
                  </div>
                  <ul className="space-y-2 max-h-36 overflow-y-auto">
                    {n.news.length ? (
                      n.news.slice(0, 3).map((item, i) => (
                        <li key={i}>
                          <a
                            href={item.url}
                            className="text-indigo-700 hover:underline font-semibold"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.title}
                          </a>
                        </li>
                      ))
                    ) : (
                      <li className="italic text-gray-600">No recent news available</li>
                    )}
                  </ul>
                </div>
              ))
            ) : (
              <p className="italic text-gray-600">Loading news...</p>
            )}
          </motion.div>
        </Section>

        {/* DYNAMIC CHARTS SECTION AT BOTTOM */}
        <Section>
          <motion.div
            whileHover={{ scale: 1.02, boxShadow: "0 8px 32px rgba(99,102,241,0.15)" }}
            className="bg-white rounded-3xl p-8 border border-gray-200 shadow"
            tabIndex={0}
            aria-label="Portfolio value over last 7 days"
          >
            <h2 className="text-3xl font-semibold text-indigo-900 mb-6">Portfolio Value Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `$${value.toFixed(0)}`} />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </Section>
      </main>
    </div>
  );
};

export default Dashboard;
