const BASE_URL = "https://crt-backend.onrender.com";

export async function scanCRT(symbol, timeframe) {
  const res = await fetch(
    `${BASE_URL}/scan?symbol=${symbol}&timeframe=${timeframe}`
  );

  if (!res.ok) {
    throw new Error("Backend error");
  }

  return await res.json();
}
