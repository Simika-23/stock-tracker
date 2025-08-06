import React, { useEffect, useState } from "react";
import clsx from "clsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getNewsSentimentApi } from "../api/Api";

const sentimentColors = {
  Bullish: "bg-green-100 text-green-700",
  Bearish: "bg-red-100 text-red-700",
  Neutral: "bg-gray-100 text-gray-700",
};

const MarketSentiment = ({ symbols = [] }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!symbols.length) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    Promise.all(
      symbols.map((symbol) =>
        getNewsSentimentApi(symbol)
          .then((res) => ({
            symbol,
            sentiment: res.data.sentiment || "Neutral",
            news: res.data.topHeadlines?.slice(0, 3) || [],
          }))
          .catch(() => ({
            symbol,
            sentiment: "Neutral",
            news: [],
          }))
      )
    )
      .then((results) => {
        setData(results);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load market sentiment data.");
        setLoading(false);
      });
  }, [symbols]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow">
        {[...Array(symbols.length || 3)].map((_, i) => (
          <div key={i} className="mb-6 border-b border-gray-200 pb-4">
            <Skeleton width={80} height={24} className="mb-2" />
            <Skeleton count={3} />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="bg-red-100 text-red-700 p-4 rounded-xl font-semibold"
      >
        {error}
      </div>
    );
  }

  if (!data.length) {
    return (
      <p className="text-gray-600 italic text-center">No market sentiment data available.</p>
    );
  }

  return (
    <div
      className="bg-white rounded-3xl p-6 border border-gray-200 shadow"
      aria-label="Market sentiment and news"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-3 h-10 bg-pink-600 rounded-full" />
        <h2 className="text-3xl font-extrabold text-pink-900">Market Sentiment</h2>
      </div>

      {data.map(({ symbol, sentiment, news }) => (
        <div key={symbol} className="mb-6 border-b border-gray-200 pb-4 last:border-none last:pb-0">
          <div className="flex items-center gap-4 mb-2">
            <span className="font-mono font-bold text-lg">{symbol}</span>
            <span
              className={clsx(
                "text-xs font-semibold px-3 py-1 rounded-full select-none",
                sentimentColors[sentiment] || sentimentColors.Neutral
              )}
              aria-label={`Sentiment: ${sentiment}`}
              title={`Sentiment: ${sentiment}`}
            >
              {sentiment}
            </span>
          </div>
          {news.length ? (
            <ul className="space-y-2 max-h-36 overflow-y-auto">
              {news.map(({ title, url }, idx) => (
                <li key={idx}>
                  <a
                    href={url}
                    className="text-pink-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Read news: ${title}`}
                  >
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 italic">No news available</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default MarketSentiment;
