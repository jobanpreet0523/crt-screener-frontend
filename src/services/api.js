const BASE_URL = "https://crt-screener-backend.onrender.com";

export async function getDojiStocks() {
  const res = await fetch(`${BASE_URL}/screener/doji`);
  return await res.json();
}
