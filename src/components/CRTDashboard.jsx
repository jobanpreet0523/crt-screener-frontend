import React from "react";
import { useState } from "react";
import { API } from "./api";

export default function Dashboard() {
  const [symbol, setSymbol] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const runBacktest = async () => {
    if (!symbol) return;
    setLoading(true);

    try {
      const res = await API.get(`/backtest/${symbol}`);
      setData(res.data);
    } catch (err) {
      alert("Error fetching backtest");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>📊 CRT Backtest Dashboard</h2>

      <input
        placeholder="Enter NSE Symbol (RELIANCE)"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        style={{ padding: 10, marginRight: 10 }}
      />

      <button onClick={runBacktest} style={{ padding: 10 }}>
        Run Backtest
      </button>

      {loading && <p>Running backtest...</p>}

      {data && (
        <div style={{ marginTop: 30 }}>
          <h3>{data.symbol}</h3>
          <p>Total Trades: {data.total_trades}</p>
          <p>Wins: {data.wins}</p>
          <p>Losses: {data.losses}</p>

          <p>
            Win Rate:{" "}
            {data.total_trades > 0
              ? ((data.wins / data.total_trades) * 100).toFixed(2)
              : 0}
            %
          </p>
        </div>
      )}
    </div>
  );
}
