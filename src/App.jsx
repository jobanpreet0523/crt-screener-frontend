import { useState } from "react";

const API_BASE = "https://crt-screener-backend-1.onrender.com";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runBacktest = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/backtest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          symbol: "NIFTY",
          timeframe: "15m",
          capital: 100000
        })
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Backend not responding" });
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>📊 CRT Backtest Dashboard</h1>

      <button onClick={runBacktest} disabled={loading}>
        {loading ? "Running..." : "Run Backtest"}
      </button>

      {result && (
        <pre style={{ marginTop: 20, background: "#111", color: "#0f0", padding: 15 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
