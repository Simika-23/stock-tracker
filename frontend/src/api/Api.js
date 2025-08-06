import axios from 'axios';

const ApiFormData = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type" : "multipart/form-data",
  },
});

const Api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type" : "application/json",
  },
});

const getAuthConfig = () => ({
  headers: {
    'authorization': `Bearer ${localStorage.getItem("token")}`
  }
})

// User APIs
export const createUserApi = (data) => Api.post("/api/user/register", data);
export const loginUserApi = (data) => Api.post("/api/user/login", data);
export const getCurrentUser = () => Api.get("/api/user/me", getAuthConfig());
export const getUser= ()=>Api.get("/api/user/getallusers",getAuthConfig());
export const getUserById= (id)=>Api.get(`/api/user/${id}`,getAuthConfig());
export const updateUserById= (id,data)=>ApiFormData.put(`/api/user/${id}`,data,getAuthConfig());
export const deleteUserById= (id)=>Api.delete(`/api/user/${id}`,getAuthConfig());

// Portfolio APIs
export const getPortfolioApi = () => Api.get("/api/portfolio", getAuthConfig());
export const addPortfolioApi = (data) => Api.post("/api/portfolio", data, getAuthConfig());
export const deletePortfolioApi= (id)=>Api.delete(`/api/portfolio/${id}`,getAuthConfig());
export const searchStock = (symbol) => Api.get(`/api/stocks/search?symbol=${symbol}`, getAuthConfig());


// Alert APIs
export const getAlertsApi = () => Api.get("/api/alerts", getAuthConfig());
export const createAlertApi = (data) => Api.post("/api/alerts", data, getAuthConfig());
export const updateAlertApi = (id, data) => Api.put(`/api/alerts/${id}`, data, getAuthConfig());
export const deleteAlertApi = (id) => Api.delete(`/api/alerts/${id}`, getAuthConfig());

// Watchlist APIs
export const getWatchlistApi = () => Api.get("/api/watchlist", getAuthConfig());
export const addToWatchlistApi = (data) => Api.post("/api/watchlist/add", data, getAuthConfig());
export const removeFromWatchlistApi = (id) => Api.delete(`/api/watchlist/${id}`, getAuthConfig());

// News Sentiment API
export const getNewsSentimentApi = (symbol) => Api.get(`/api/news/sentiment?symbol=${symbol}`, getAuthConfig());

// Notification API
export const getNotificationsApi = () => Api.get("/api/notifications", getAuthConfig());
export const markNotificationAsReadApi = (id) => Api.put(`/api/notifications/${id}/read`, {}, getAuthConfig());
