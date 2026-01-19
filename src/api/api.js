import axios from "axios";

export const API = axios.create({
  baseURL: "https://YOUR-BACKEND-URL.onrender.com",
});

