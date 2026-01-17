import { useState } from "react";

const API_BASE = "https://crt-screener-backend.onrender.com";

export default function CRTScreener() {
  const [timeframe, setTimeframe] = useState("daily");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const runScan = async () => {
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch(`${API_BASE}/scan?tf=${timeframe}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Scan failed");
      }

      setResults(data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 CRT Screener</h2>

      {/* Controls */}
      <div style={styles.controls}>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          style={styles.select}
        >
          <option value="daily">Daily</option>
          <option value="4h">4H</option>
          <option value="1h">1H</option>
          <option value="15m">15M</option>
        </select>

        <button onClick={runScan} style={styles.button}>
          {loading ? "Scanning..." : "Run Scan"}
        </button>
      </div>

      {/* Errors */}
      {error && <p style={styles.error}>❌ {error}</p>}

      {/* Results */}
      <table style={styles.table}>
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
                No results
              </td>
            </tr>
          ) : (
            results.map((row, idx) => (
              <tr key={idx}>
                <td>{row.symbol}</td>
                <td
                  style={{
                    color:
                      row.crt === "Bullish"
                        ? "#16a34a"
                        : row.crt === "Bearish"
                        ? "#dc2626"
                        : "#444",
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

/* ---------- Styles ---------- */

const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    marginBottom: "20px",
  },
  controls: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  select: {
    padding: "8px",
    fontSize: "16px",
  },
  button: {
    padding: "8px 16px",
    fontSize: "16px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};
