import React, { useEffect, useState } from "react";

const BACKEND_URL = "https://crt-backend.onrender.com";

export default function CRTScreener() {
  const [timeframe, setTimeframe] = useState("daily");
  const [symbol, setSymbol] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------------------
     AUTO WARM-UP (Render Fix)
  ----------------------------*/
  useEffect(() => {
    const ping = () => {
      fetch(`${BACKEND_URL}/`)
        .then(() => console.log("Backend warmed"))
        .catch(() => console.log("Backend sleep"));
    };

    ping(); // on load
    const interval = setInterval(ping, 5 * 60 * 1000); // every 5 min
    return () => clearInterval(interval);
  }, []);

  /* ---------------------------
     RUN SCAN
  ----------------------------*/
  const runScan = async () => {
    setLoading(true);
    setError("");
    setResults([]);

    try {
      let url = "";

      // Single symbol scan
      if (symbol.trim() !== "") {
        url = `${BACKEND_URL}/scan?symbol=${symbol}&timeframe=${timeframe}`;
      }
      // Batch scan (NSE stocks)
      else {
        url = `${BACKEND_URL}/scan-batch?timeframe=${timeframe}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (!data || data.length === 0) {
        setError("No CRT found for the selected timeframe.");
      } else {
        setResults(data);
      }
    } catch (err) {
      setError("Backend not responding. Try again.");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>CRT Screener Dashboard</h2>

      {/* Controls */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="15m">15 Min</option>
          <option value="5m">5 Min</option>
        </select>

        <input
          type="text"
          placeholder="Search symbol..."
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        />

        <button onClick={runScan}>Run Scan</button>
      </div>

      {/* Status */}
      {loading && <p>Scanning market…</p>}
      {error && <p style={{ color: "gray" }}>{error}</p>}

      {/* Results Table */}
      {results.length > 0 && (
        <table width="100%" border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Timeframe</th>
              <th>CRT Type</th>
              <th>Chart</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row, i) => (
              <tr key={i}>
                <td>{row.symbol}</td>
                <td>{row.timeframe}</td>
                <td>{row.crt_type}</td>
                <td>
                  <a
                    href={`https://www.tradingview.com/chart/?symbol=NSE:${row.symbol}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
