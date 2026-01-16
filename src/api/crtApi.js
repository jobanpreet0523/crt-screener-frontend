const BASE_URL = "https://crt-screener-backend.onrender.com";

export async function fetchCRT(tf = "daily") {
  const res = await fetch(`${BASE_URL}/scan?tf=${tf}`);

  if (!res.ok) {
    throw new Error("Failed to fetch CRT data");
  }

  return res.json();
}
