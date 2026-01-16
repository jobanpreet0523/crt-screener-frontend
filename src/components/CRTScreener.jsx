import { useEffect, useState } from "react";

const API_URL = "https://crt-screener-backend.onrender.com";

export default function CRTScreener() {
  const [results, setResults] = useState([]);
  const [timeframe, setTimeframe] = useState("daily");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [timeframe]);

  async function fetchData() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/scan?tf=${timeframe}`);
      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      setError("Failed to load CRT data");
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>CRT Market Screener</h2>

      {/* Timeframe Selector */}
      <select
        value={timeframe}
        onChange={(e) => setTimeframe(e.target.value)}
        style={{ marginBottom: "15px" }}
      >
        <option value="daily">Daily</option>
        <option value="4h">4H</option>
        <option value="1h">1H</option>
      </select>

      {/* Status */}
      {loading && <p>Scanning markets...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Results Table */}
      <table
        border="1"
        cellPadding="8"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Symbol</th>
            <th>CRT Bias</th>
            <th>Timeframe</th>
          </tr>
        </thead>
        <tbody>
          {results.length === 0 && !loading ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No CRT setups found
              </td>
            </tr>
          ) : (
            results.map((row, index) => (
              <tr key={index}>
                <td>{row.symbol}</td>
                <td
                  style={{
                    color:
                      row.crt === "Bullish"
                        ? "green"
                        : row.crt === "Bearish"
                        ? "red"
                        : "gray",
                    fontWeight: "bold",
                  }}
                >
                  {row.crt}
                </td>
                <td>{row.timeframe}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
