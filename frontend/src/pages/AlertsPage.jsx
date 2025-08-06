import React, { useEffect, useState } from "react";
import {
  getAlertsApi,
  createAlertApi,
  updateAlertApi,
  deleteAlertApi,
} from "../api/Api";
import axios from "axios";

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [formData, setFormData] = useState({
    stockSymbol: "",
    targetPrice: "",
    condition: "above",
  });
  const [error, setError] = useState("");

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const { data } = await getAlertsApi();
      if (data.success) {
        setAlerts(data.data);
      } else {
        setAlerts([]);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const runManualCheck = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/alerts/check`, {
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch (err) {
      console.error("Manual check failed:", err);
    }
  };

  const handleOpenModal = (alert = null) => {
    setEditingAlert(alert);
    setFormData(
      alert
        ? {
            stockSymbol: alert.stockSymbol,
            targetPrice: alert.targetPrice,
            condition: alert.condition,
          }
        : { stockSymbol: "", targetPrice: "", condition: "above" }
    );
    setError("");
    setOpenModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.stockSymbol.trim()) {
      setError("Stock symbol is required");
      return false;
    }
    if (!formData.targetPrice || isNaN(formData.targetPrice) || Number(formData.targetPrice) <= 0) {
      setError("Target price must be a positive number");
      return false;
    }
    if (!["above", "below"].includes(formData.condition)) {
      setError("Condition must be either 'above' or 'below'");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (editingAlert) {
        await updateAlertApi(editingAlert.id, formData);
      } else {
        await createAlertApi(formData);
      }
      setOpenModal(false);
      await fetchAlerts();
      runManualCheck(); // trigger alert check instantly
    } catch (err) {
      console.error(err);
      setError("Failed to save alert. Try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this alert?")) return;
    try {
      await deleteAlertApi(id);
      fetchAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Alerts</h1>

      <button
        onClick={() => handleOpenModal()}
        className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
      >
        + Create New Alert
      </button>

      {loading ? (
        <p>Loading alerts...</p>
      ) : alerts.length === 0 ? (
        <p>No alerts found. Create one above.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-indigo-100">
              <th className="border px-3 py-2 text-left">Stock Symbol</th>
              <th className="border px-3 py-2 text-left">Target Price</th>
              <th className="border px-3 py-2 text-left">Condition</th>
              <th className="border px-3 py-2 text-left">Active</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map(({ id, stockSymbol, targetPrice, condition, isActive }) => (
              <tr key={id} className="hover:bg-indigo-50">
                <td className="border px-3 py-2 uppercase">{stockSymbol}</td>
                <td className="border px-3 py-2">${targetPrice}</td>
                <td className="border px-3 py-2 capitalize">{condition}</td>
                <td className="border px-3 py-2 text-center">
                  {isActive ? "Yes" : "No"}
                </td>
                <td className="border px-3 py-2 space-x-2 text-center">
                  <button
                    onClick={() => handleOpenModal({ id, stockSymbol, targetPrice, condition })}
                    className="text-indigo-700 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {openModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editingAlert ? "Edit Alert" : "Create Alert"}
            </h2>

            <label className="block mb-2">
              Stock Symbol:
              <input
                type="text"
                name="stockSymbol"
                value={formData.stockSymbol}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mt-1 uppercase"
                maxLength={5}
                autoFocus
              />
            </label>

            <label className="block mb-2">
              Target Price:
              <input
                type="number"
                name="targetPrice"
                value={formData.targetPrice}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mt-1"
                min="0"
                step="0.01"
              />
            </label>

            <label className="block mb-4">
              Condition:
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mt-1"
              >
                <option value="above">Above</option>
                <option value="below">Below</option>
              </select>
            </label>

            {error && (
              <p className="text-red-600 mb-4" role="alert">
                {error}
              </p>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                {editingAlert ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
