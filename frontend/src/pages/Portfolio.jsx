import React, { useEffect, useState } from "react";
import { getPortfolioApi } from "../api/Api";

const PortfolioPage = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const res = await getPortfolioApi();
        setPortfolio(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch portfolio");
      }
    }
    fetchPortfolio();
  }, []);

  const calculateTotalInvestment = (item) => {
    return (item.quantity * item.purchasePrice).toFixed(2);
  };

  const calculateTotalPortfolio = () => {
    return portfolio
      .reduce((acc, item) => acc + item.quantity * item.purchasePrice, 0)
      .toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 md:p-10 w-full max-w-3xl space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-indigo-800">📊 My Portfolio</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
            {error}
          </div>
        )}

        {portfolio.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              {portfolio.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-gray-50 rounded-xl shadow hover:shadow-md transition"
                >
                  <p className="font-semibold text-lg text-indigo-700">📈 Stock: {item.stockSymbol.toUpperCase()}</p>
                  <p className="text-gray-700">Quantity: {item.quantity}</p>
                  <p className="text-gray-700">Buy Price: ₹{item.purchasePrice.toFixed(2)}</p>
                  <p className="text-green-700 font-semibold">
                    Investment: ₹{calculateTotalInvestment(item)}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center pt-6 border-t mt-6">
              <p className="text-lg font-bold text-indigo-800">
                💰 Total Investment: ₹{calculateTotalPortfolio()}
              </p>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600">No portfolio data found.</p>
        )}
      </div>
    </div>
  );
};

export default PortfolioPage;
