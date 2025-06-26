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

// (data) => this is a parameter.
export const createUserApi = (data) => ApiFormData.post("/api/user/register", data)

export const loginUserApi = (data) => Api.post("/api/user/login", data)