import React, { useEffect, useState } from "react";
import { getPortfolioApi, deletePortfolioApi } from "../api/Api";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CountUp from "react-countup";
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";

const formatCurrency = (val) =>
  val === null || val === undefined
    ? "-"
    : `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

const formatPercentage = (val) =>
  val === null || val === undefined ? "-" : `${Number(val).toFixed(2)}%`;

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "stockSymbol", direction: "asc" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getPortfolioApi();
        if (res.data.success) {
          setPortfolio(res.data.data);
        } else {
          setError("Failed to fetch portfolio data");
        }
      } catch (err) {
        setError("Server error while fetching portfolio");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  // Sort handler
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const sortedPortfolio = React.useMemo(() => {
    if (!portfolio) return [];
    const sorted = [...portfolio];
    sorted.sort((a, b) => {
      let aValue, bValue;
      switch (sortConfig.key) {
        case "stockSymbol":
          aValue = a.stockSymbol;
          bValue = b.stockSymbol;
          break;
        case "quantity":
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case "purchasePrice":
          aValue = a.purchasePrice;
          bValue = b.purchasePrice;
          break;
        case "currentPrice":
          aValue = a.live?.price ?? 0;
          bValue = b.live?.price ?? 0;
          break;
        case "dailyChangePct":
          aValue =
            a.live && a.purchasePrice
              ? ((a.live.price - a.purchasePrice) / a.purchasePrice) * 100
              : 0;
          bValue =
            b.live && b.purchasePrice
              ? ((b.live.price - b.purchasePrice) / b.purchasePrice) * 100
              : 0;
          break;
        case "totalValue":
          aValue = (a.live?.price ?? a.purchasePrice) * a.quantity;
          bValue = (b.live?.price ?? b.purchasePrice) * b.quantity;
          break;
        case "profitLoss":
          aValue =
            a.live && a.purchasePrice
              ? (a.live.price - a.purchasePrice) * a.quantity
              : 0;
          bValue =
            b.live && b.purchasePrice
              ? (b.live.price - b.purchasePrice) * b.quantity
              : 0;
          break;
        default:
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
      }

      if (typeof aValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }
    });
    return sorted;
  }, [portfolio, sortConfig]);

  // Calculate overall portfolio summary
  const totalInvested = portfolio.reduce((sum, p) => sum + p.purchasePrice * p.quantity, 0);
  const totalCurrent = portfolio.reduce(
    (sum, p) => sum + (p.live?.price ?? p.purchasePrice) * p.quantity,
    0
  );
  const totalProfitLoss = totalCurrent - totalInvested;
  const totalProfitLossPct = totalInvested === 0 ? 0 : (totalProfitLoss / totalInvested) * 100;

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this stock?")) return;
    try {
      await deletePortfolioApi(id);
      setPortfolio((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("Failed to delete. Please try again.");
    }
  };

  if (loading) {
    return (
      <main className="pt-20 px-4 max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Your Portfolio</h1>
        <Skeleton height={40} count={1} />
        <Skeleton count={8} />
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-20 px-4 max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Your Portfolio</h1>
        <p className="text-red-600 font-semibold">{error}</p>
      </main>
    );
  }

  return (
    <main className="pt-20 px-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 font-sans">Your Portfolio</h1>

      {/* Summary */}
      <section className="mb-8 p-6 rounded-xl bg-gray-50 shadow-sm flex flex-wrap justify-between gap-4">
        <div>
          <p className="text-sm text-gray-600 font-semibold">Total Invested</p>
          <p className="text-2xl font-bold text-indigo-700">
            <CountUp end={totalInvested} duration={1.5} prefix="$" separator="," decimals={2} />
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 font-semibold">Current Value</p>
          <p className="text-2xl font-bold text-indigo-700">
            <CountUp end={totalCurrent} duration={1.5} prefix="$" separator="," decimals={2} />
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 font-semibold">Profit / Loss</p>
          <p
            className={clsx(
              "text-2xl font-bold",
              totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"
            )}
          >
            <CountUp
              end={Math.abs(totalProfitLoss)}
              duration={1.5}
              prefix={totalProfitLoss >= 0 ? "+$" : "-$"}
              separator=","
              decimals={2}
            />
          </p>
          <p
            className={clsx(
              "font-semibold",
              totalProfitLossPct >= 0 ? "text-green-600" : "text-red-600"
            )}
          >
            {formatPercentage(totalProfitLossPct)}
          </p>
        </div>
        <Link
          to="/portfolio/add"
          className="self-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow transition focus:outline-none focus:ring-2 ring-indigo-500"
        >
          + Add Stock
        </Link>
      </section>

      {/* Portfolio Table */}
      <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
        <table className="w-full table-auto border-collapse text-left font-sans">
          <thead className="bg-indigo-100">
            <tr>
              {[
                { key: "stockSymbol", label: "Symbol" },
                { key: "live.name", label: "Company" },
                { key: "quantity", label: "Quantity" },
                { key: "purchasePrice", label: "Buy Price" },
                { key: "currentPrice", label: "Current Price" },
                { key: "dailyChangePct", label: "Daily Change %" },
                { key: "totalValue", label: "Total Value" },
                { key: "profitLoss", label: "Profit / Loss" },
                { key: "actions", label: "Actions" },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className="px-4 py-3 cursor-pointer select-none text-indigo-900 font-semibold"
                  onClick={() => key !== "actions" && requestSort(key)}
                  scope="col"
                >
                  {label}
                  {sortConfig.key === key && key !== "actions" ? (
                    sortConfig.direction === "asc" ? " ▲" : " ▼"
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedPortfolio.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-8 text-gray-600">
                  No portfolio stocks found.
                </td>
              </tr>
            )}
            {sortedPortfolio.map((item) => {
              const dailyChangePct =
                item.live && item.purchasePrice
                  ? ((item.live.price - item.purchasePrice) / item.purchasePrice) * 100
                  : null;
              const totalValue = (item.live?.price ?? item.purchasePrice) * item.quantity;
              const profitLoss =
                item.live && item.purchasePrice
                  ? (item.live.price - item.purchasePrice) * item.quantity
                  : null;

              return (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-indigo-50 transition"
                >
                  <td className="px-4 py-3 font-mono font-bold text-indigo-800">{item.stockSymbol}</td>
                  <td className="px-4 py-3">{item.live?.name ?? "-"}</td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">{formatCurrency(item.purchasePrice)}</td>
                  <td className="px-4 py-3 font-semibold">
                    {formatCurrency(item.live?.price)}
                  </td>
                  <td
                    className={clsx(
                      "px-4 py-3 font-semibold",
                      dailyChangePct >= 0 ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {formatPercentage(dailyChangePct)}
                  </td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(totalValue)}</td>
                  <td
                    className={clsx(
                      "px-4 py-3 font-semibold",
                      profitLoss >= 0 ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {formatCurrency(profitLoss)}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => navigate(`/portfolio/edit/${item.id}`)}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold"
                      aria-label={`Edit ${item.stockSymbol}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                      aria-label={`Delete ${item.stockSymbol}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Portfolio;


