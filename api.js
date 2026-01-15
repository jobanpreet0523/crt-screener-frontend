const API_URL = "https://crt-screener-backend.onrender.com";

export async function scanMarket(tf) {
  const res = await fetch(`${API_URL}/scan?tf=${tf}`);
  return res.json();
}
