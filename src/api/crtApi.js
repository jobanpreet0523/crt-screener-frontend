import api from "../services/api";

export const fetchCRT = async () => {
  const res = await api.get("/scan");
  return res.data;
};
