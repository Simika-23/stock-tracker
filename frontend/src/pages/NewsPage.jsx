// src/pages/NewsPage.jsx
import React, { useEffect, useState } from "react";
import { getNewsSentimentApi } from "../api/Api";  // your api call helper
import clsx from "clsx";

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const NewsPage = () => {
  const [newsData, setNewsData] = useState([]);
  const [sentiment, setSentiment] = useState("Neutral");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // You can adjust or allow user to input symbols later
  const symbol = "STOCK MARKET";

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await getNewsSentimentApi(symbol);
        if (res.data.success) {
          setNewsData(res.data.data.topHeadlines || []);
          setSentiment(res.data.data.sentiment || "Neutral");
        } else {
          setError("Failed to load news data.");
        }
      } catch (err) {
        setError("Error fetching news data.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [symbol]);

  return (
    <main className="pt-24 p-4 max-w-7xl mx-auto font-inter">
      <h1 className="text-4xl font-extrabold mb-6 text-pink-900">Market News</h1>

      <div className="mb-6">
        <span
          className={clsx(
            "inline-block px-4 py-1 rounded-full text-xs font-semibold select-none",
            sentiment === "Bullish"
              ? "bg-green-100 text-green-800"
              : sentiment === "Bearish"
              ? "bg-red-100 text-red-800"
              : "bg-gray-200 text-gray-700"
          )}
          aria-label={`Market sentiment is ${sentiment}`}
        >
          Sentiment: {sentiment}
        </span>
      </div>

      {loading && <p className="text-gray-600">Loading news...</p>}

      {error && (
        <p role="alert" className="text-red-600 font-semibold">
          {error}
        </p>
      )}

      {!loading && !error && newsData.length === 0 && (
        <p className="text-gray-600 italic">No news available at the moment.</p>
      )}

      {!loading && !error && newsData.length > 0 && (
        <ul className="space-y-6">
          {newsData.map((article, idx) => (
            <li
              key={idx}
              className="border-b border-gray-200 pb-4 last:border-none"
              tabIndex={0}
            >
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 font-semibold text-lg hover:underline"
              >
                {article.title}
              </a>
              <p className="text-gray-700 mt-1">{article.description || ""}</p>
              <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-2">
                <span>{article.source.name}</span>
                <span aria-label={`Published on ${formatDate(article.publishedAt)}`}>
                  {formatDate(article.publishedAt)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default NewsPage;
