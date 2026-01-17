export async function fetchCRTResults({ market, timeframe }) {
  const response = await fetch(
    `https://YOUR-BACKEND-URL/api/crt-scan?market=${market}&tf=${timeframe}`
  );

  if (!response.ok) {
    throw new Error("Scanner API failed");
  }

  return response.json();
}
