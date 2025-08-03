import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRightIcon, ArrowDownRightIcon } from '@heroicons/react/24/solid';
import { getPortfolioApi } from '../api/Api'; // Adjust the import path as needed

/**
 * Portfolio Component
 * Displays user's stock portfolio with live market data.
 * Handles authentication, API fetching, and user-friendly UI states.
 */
const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const response = await getPortfolioApi();
        if (response.data.success) {
          setPortfolio(response.data.data);
          setErrorMessage(null);
        } else {
          setErrorMessage('Failed to fetch portfolio data.');
        }
      } catch (error) {
        console.error('Error fetching portfolio:', error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        } else {
          setErrorMessage('An unexpected error occurred. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [navigate]);

  if (loading) {
    return (
      <div className="text-center p-10 text-lg font-semibold text-gray-700">
        Loading portfolio...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="text-center p-10 text-lg font-semibold text-red-600">
        {errorMessage}
      </div>
    );
  }

  if (portfolio.length === 0) {
    return (
      <div className="text-center p-10 text-lg font-medium text-gray-600">
        Your portfolio is currently empty. Start adding stocks to track your investments!
        <button
          onClick={() => navigate('/add-stock')} // Change route if needed
          className="mt-4 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add Stocks
        </button>
      </div>
    );
  }

  return (
    <section className="p-8 max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
        Stock Portfolio Overview
      </h2>
      <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm font-sans">
          <thead className="bg-gray-50 text-gray-700 font-semibold">
            <tr>
              <th scope="col" className="px-6 py-4">#</th>
              <th scope="col" className="px-6 py-4">Stock</th>
              <th scope="col" className="px-6 py-4">Quantity</th>
              <th scope="col" className="px-6 py-4">Purchase Price (USD)</th>
              <th scope="col" className="px-6 py-4">Live Price (USD)</th>
              <th scope="col" className="px-6 py-4">% Change</th>
              <th scope="col" className="px-6 py-4">Date Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-800">
            {portfolio.map((item, index) => {
              const live = item.live || {};
              const price = live.price ? `$${parseFloat(live.price).toFixed(2)}` : 'N/A';
              const percent = live.change_percent !== undefined && live.change_percent !== null
                ? parseFloat(live.change_percent)
                : null;
              const isGain = percent > 0;
              const isLoss = percent < 0;

              return (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-3">{index + 1}</td>
                  <td className="px-6 py-3 font-semibold text-blue-700">{item.stockSymbol}</td>
                  <td className="px-6 py-3">{item.quantity ?? '-'}</td>
                  <td className="px-6 py-3">
                    {item.purchasePrice !== undefined && item.purchasePrice !== null
                      ? `$${item.purchasePrice.toFixed(2)}`
                      : '-'}
                  </td>
                  <td className="px-6 py-3">{price}</td>
                  <td className={`px-6 py-3 ${isGain ? 'text-green-600' : isLoss ? 'text-red-600' : 'text-gray-600'}`}>
                    {percent !== null ? (
                      <div className="flex items-center font-medium">
                        {isGain ? (
                          <ArrowUpRightIcon className="w-4 h-4 mr-1" aria-label="Price up" />
                        ) : isLoss ? (
                          <ArrowDownRightIcon className="w-4 h-4 mr-1" aria-label="Price down" />
                        ) : null}
                        {percent.toFixed(2)}%
                      </div>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="px-6 py-3 text-gray-600">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'N/A'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Portfolio;
