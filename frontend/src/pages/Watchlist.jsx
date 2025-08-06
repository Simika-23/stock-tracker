import React, { useEffect, useState } from "react";
import { getWatchlistApi, addToWatchlistApi, removeFromWatchlistApi } from "../api/Api";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import clsx from "clsx";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSymbol, setNewSymbol] = useState("");
  const [error, setError] = useState(null);

  // Fetch Watchlist
  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const res = await getWatchlistApi();
      if (res.data.success) setWatchlist(res.data.data);
      else setError("Failed to load watchlist.");
    } catch (err) {
      setError("Server error while fetching watchlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  // Add stock
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newSymbol.trim()) return alert("Please enter a stock symbol");
    try {
      const res = await addToWatchlistApi({ stockSymbol: newSymbol });
      if (res.data.success) {
        setNewSymbol("");
        fetchWatchlist();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Failed to add stock to watchlist.");
    }
  };

  // Remove stock
  const handleRemove = async (id) => {
    if (!window.confirm("Remove this stock from watchlist?")) return;
    try {
      await removeFromWatchlistApi(id);
      setWatchlist((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("Failed to remove stock from watchlist.");
    }
  };

  if (loading) {
    return (
      <main className="pt-20 px-4 max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Your Watchlist</h1>
        <Skeleton height={40} count={1} />
        <Skeleton count={8} />
      </main>
    );
  }

  return (
    <main className="pt-20 px-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Your Watchlist</h1>

      {/* Add stock form */}
      <form onSubmit={handleAdd} className="mb-6 flex gap-3">
        <input
          type="text"
          value={newSymbol}
          onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
          placeholder="Enter Stock Symbol (e.g., AAPL)"
          className="border border-gray-300 rounded-lg px-4 py-2 flex-grow focus:outline-none focus:ring-2 ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
        >
          + Add
        </button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Watchlist Table */}
      <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
        <table className="w-full table-auto border-collapse text-left font-sans">
          <thead className="bg-indigo-100">
            <tr>
              <th className="px-4 py-3 font-semibold text-indigo-900">Symbol</th>
              <th className="px-4 py-3 font-semibold text-indigo-900">Price</th>
              <th className="px-4 py-3 font-semibold text-indigo-900">Added On</th>
              <th className="px-4 py-3 font-semibold text-indigo-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {watchlist.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-600">
                  No stocks in your watchlist yet.
                </td>
              </tr>
            )}
            {watchlist.map((item) => (
              <tr key={item.id} className="border-b border-gray-200 hover:bg-indigo-50">
                <td className="px-4 py-3 font-bold text-indigo-800">{item.stockSymbol}</td>
                <td className="px-4 py-3">{item.price ? `$${parseFloat(item.price).toFixed(2)}` : "N/A"}</td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Watchlist;
