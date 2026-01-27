const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export async function scanCRT(symbol: string, timeframe: string) {
  const res = await fetch(
    `${API_BASE}/scan/crt?symbol=${symbol}&timeframe=${timeframe}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("CRT API failed");
  }

  return res.json();
}
