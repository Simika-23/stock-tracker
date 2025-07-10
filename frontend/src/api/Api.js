import axios from 'axios';
import { configs } from 'eslint-plugin-react-refresh';

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

// API calls
// (data) => this is a parameter.
export const createUserApi = (data) => Api.post("/api/user/register", data)
export const loginUserApi = (data) => Api.post("/api/user/login", data)
export const getUser= ()=>Api.get("/api/user/getallusers",getAuthConfig())
export const getUserById= (id)=>Api.get(`/api/user/${id}`,getAuthConfig())
export const updateUserById= (id,data)=>ApiFormData.put(`/api/user/${id}`,data,getAuthConfig())
export const deleteUserById= (id)=>Api.delete(`/api/user/${id}`,getAuthConfig())

export const getPortfolioApi = () => Api.get("/api/portfolio", getAuthConfig());
export const addPortfolioApi = (data) => Api.post("/api/portfolio", data, getAuthConfig());


