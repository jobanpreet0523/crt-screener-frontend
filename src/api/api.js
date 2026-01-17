const BASE_URL = "http://127.0.0.1:8000";
// or deployed URL

export const scanCRT = async (symbol, timeframe) => {
  const res = await fetch(
    `${BASE_URL}/scan?symbol=${symbol}&timeframe=${timeframe}`
  );
  return res.json();
};
