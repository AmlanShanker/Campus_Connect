import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export function setAuthToken(token) {
  if (token) {
    http.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete http.defaults.headers.common.Authorization;
}

export default http;
