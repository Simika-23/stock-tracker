// src/pages/StockListPage.jsx
import React, { useEffect, useState } from "react";
import { searchStock, addPortfolioApi } from "../api/Api"; // Assuming you have searchStock and addPortfolioApi in your API file
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const StockListPage = () => {
  const [stocks, setStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Sample list of popular stocks — you can replace or expand this with a real API call to fetch a list
  const popularStocks = ["AAPL", "MSFT", "GOOGL", "TSLA", "AMZN", "FB", "NFLX"];

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      const fetchedStocks = [];

      for (const symbol of popularStocks) {
        try {
          const res = await searchStock(symbol);
          if (res.data.success) {
            fetchedStocks.push(res.data.data);
          }
        } catch (error) {
          console.error(`Error fetching stock ${symbol}`, error);
        }
      }

      setStocks(fetchedStocks);
      setLoading(false);
    };

    fetchStocks();
  }, []);

  const handleAddStock = async (stock) => {
    try {
      // Use API price as purchasePrice — no user input needed for price
      const data = {
        stockSymbol: stock.symbol,
        quantity: 1, // Default quantity, you can add a UI to select this if you want
        purchasePrice: stock.price,
      };
      const res = await addPortfolioApi(data);

      if (res.data.success) {
        toast.success(`Added ${stock.symbol} to your portfolio`);
        navigate("/portfolio"); // Redirect after adding
      } else {
        toast.error("Failed to add stock");
      }
    } catch (error) {
      toast.error("Error adding stock");
    }
  };

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Add Stocks</h1>

      <button
        onClick={() => navigate("/portfolio")}
        className="mb-4 text-indigo-600 hover:underline"
      >
        ← Back to Portfolio
      </button>

      <input
        type="text"
        placeholder="Search stocks..."
        className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p>Loading stocks...</p>
      ) : (
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-indigo-100">
              <th className="border border-gray-300 px-4 py-2">Symbol</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Price ($)</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No stocks found.
                </td>
              </tr>
            ) : (
              filteredStocks.map((stock) => (
                <tr key={stock.symbol} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{stock.symbol}</td>
                  <td className="border border-gray-300 px-4 py-2">{stock.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{stock.price.toFixed(2)}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleAddStock(stock)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Add
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StockListPage;
