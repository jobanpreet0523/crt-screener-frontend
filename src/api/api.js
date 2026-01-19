const BASE_URL = "https://crt-screener-backend.onrender.com";

export async function fetchDoji() {
  const res = await fetch(`${BASE_URL}/screener/doji`);
  if (!res.ok) throw new Error("Backend error");
  return res.json();
}
