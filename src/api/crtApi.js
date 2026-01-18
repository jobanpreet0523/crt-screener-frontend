export async function fetchCrtScan(market = "NIFTY", tf = "15m") {
  const url = `https://crt-screener-backend.onrender.com/api/crt-scan?market=${market}&tf=${tf}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch CRT scan");
  }

  return res.json();
}
