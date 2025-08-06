import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addPortfolioApi, searchStock } from "../api/Api";

const AddStock = () => {
  const [stockSymbol, setStockSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  // Optional: Verify stock symbol by calling searchStock API (could improve UX)
  const validateSymbol = async (symbol) => {
    try {
      const res = await searchStock(symbol);
      return res.data.success && res.data.data;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic validation
    if (!stockSymbol.trim()) {
      setError("Stock symbol is required");
      return;
    }
    if (!quantity || quantity <= 0) {
      setError("Quantity must be a positive number");
      return;
    }
    if (!purchasePrice || purchasePrice <= 0) {
      setError("Purchase price must be a positive number");
      return;
    }

    setLoading(true);

    try {
      // Optional: validate stock symbol exists in the market
      const validSymbol = await validateSymbol(stockSymbol.trim().toUpperCase());
      if (!validSymbol) {
        setError("Invalid stock symbol or no data found");
        setLoading(false);
        return;
      }

      // Prepare payload
      const payload = {
        stockSymbol: stockSymbol.trim().toUpperCase(),
        quantity: Number(quantity),
        purchasePrice: Number(purchasePrice),
      };

      // Call backend API to add
      const res = await addPortfolioApi(payload);

      if (res.data.success) {
        setSuccess("Stock added successfully!");
        // Redirect after short delay
        setTimeout(() => {
          navigate("/portfolio");
        }, 1500);
      } else {
        setError(res.data.message || "Failed to add stock");
      }
    } catch (err) {
      setError("Server error while adding stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-20 px-4 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Add New Stock</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        {error && <p className="text-red-600 font-semibold">{error}</p>}
        {success && <p className="text-green-600 font-semibold">{success}</p>}

        <div>
          <label htmlFor="stockSymbol" className="block font-semibold mb-1">
            Stock Symbol
          </label>
          <input
            id="stockSymbol"
            type="text"
            value={stockSymbol}
            onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="E.g. AAPL"
            maxLength={10}
            autoComplete="off"
            required
          />
        </div>

        <div>
          <label htmlFor="quantity" className="block font-semibold mb-1">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="E.g. 100"
            required
          />
        </div>

        <div>
          <label htmlFor="purchasePrice" className="block font-semibold mb-1">
            Purchase Price (per share)
          </label>
          <input
            id="purchasePrice"
            type="number"
            step="0.01"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            min="0.01"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="E.g. 150.25"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Stock"}
        </button>
      </form>
    </main>
  );
};

export default AddStock;
