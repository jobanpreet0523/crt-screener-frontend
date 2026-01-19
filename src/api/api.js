import axios from "axios";

export const API = axios.create({
  baseURL: "https://crt-screener-backend.onrender.com"
});
