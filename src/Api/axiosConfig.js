import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_URL_BASE,
});

export const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export default api;
