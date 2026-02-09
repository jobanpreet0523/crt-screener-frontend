import { useMemo, useState } from "react";
import "./index.css";

const MOCK_STOCKS = [
  { symbol: "AAPL", open: 188.1, high: 190.25, low: 186.96, close: 188.23, volume: 52340000, changePct: 0.08 },
  { symbol: "MSFT", open: 414.3, high: 416.1, low: 410.82, close: 414.31, volume: 21780000, changePct: 0.0 },
  { symbol: "NVDA", open: 712.3, high: 725.4, low: 707.2, close: 711.9, volume: 49210000, changePct: -0.06 },
  { symbol: "AMZN", open: 178.2, high: 179.9, low: 176.4, close: 178.05, volume: 38140000, changePct: -0.08 },
  { symbol: "TSLA", open: 225.1, high: 231.7, low: 224.5, close: 225.17, volume: 66180000, changePct: 0.03 },
  { symbol: "META", open: 492.5, high: 496.1, low: 487.6, close: 492.58, volume: 18420000, changePct: 0.02 },
  { symbol: "NFLX", open: 612.9, high: 618.8, low: 611.2, close: 612.95, volume: 6900000, changePct: 0.01 },
  { symbol: "AMD", open: 164.2, high: 167.3, low: 162.4, close: 164.22, volume: 43220000, changePct: 0.01 },
  { symbol: "GOOGL", open: 164.1, high: 165.2, low: 162.8, close: 163.92, volume: 25360000, changePct: -0.11 },
  { symbol: "INTC", open: 42.2, high: 42.8, low: 41.7, close: 42.19, volume: 40210000, changePct: -0.02 },
  { symbol: "MSTR", open: 1312.4, high: 1355.8, low: 1280.1, close: 1312.5, volume: 2360000, changePct: 0.01 },
  { symbol: "SHOP", open: 79.8, high: 81.7, low: 79.2, close: 79.81, volume: 12800000, changePct: 0.01 },
];

function bodySize(candle) {
  return Math.abs(candle.open - candle.close);
}

function fullRange(candle) {
  return candle.high - candle.low;
}

function upperWick(candle) {
  return candle.high - Math.max(candle.open, candle.close);
}

function lowerWick(candle) {
  return Math.min(candle.open, candle.close) - candle.low;
}

function dojiScore(candle) {
  const range = fullRange(candle);
  if (!range) return 0;
  const bodyRatio = bodySize(candle) / range;
  const wickBalance = 1 - Math.abs(upperWick(candle) - lowerWick(candle)) / range;
  return Math.max(0, (1 - bodyRatio) * 70 + wickBalance * 30);
}

function dojiType(candle) {
  const up = upperWick(candle);
  const down = lowerWick(candle);
  const body = bodySize(candle);
  if (body < 0.12 && up > 1.5 * body && down > 1.5 * body) return "Long-Legged Doji";
  if (up > down * 2) return "Gravestone Doji";
  if (down > up * 2) return "Dragonfly Doji";
  return "Neutral Doji";
}

export default function App() {
  const [symbolQuery, setSymbolQuery] = useState("");
  const [minVolume, setMinVolume] = useState(5000000);
  const [maxBodyPercent, setMaxBodyPercent] = useState(12);
  const [sortBy, setSortBy] = useState("score");
  const [scanTime, setScanTime] = useState(null);

  const results = useMemo(() => {
    const filtered = MOCK_STOCKS.map((stock) => {
      const range = fullRange(stock);
      const bodyPercent = range ? (bodySize(stock) / range) * 100 : 0;
      return {
        ...stock,
        score: dojiScore(stock),
        bodyPercent,
        type: dojiType(stock),
      };
    }).filter((stock) => {
      const matchSymbol = stock.symbol.toLowerCase().includes(symbolQuery.toLowerCase());
      const matchVolume = stock.volume >= minVolume;
      const matchBody = stock.bodyPercent <= maxBodyPercent;
      return matchSymbol && matchVolume && matchBody;
    });

    const sorters = {
      score: (a, b) => b.score - a.score,
      volume: (a, b) => b.volume - a.volume,
      symbol: (a, b) => a.symbol.localeCompare(b.symbol),
    };

    return filtered.sort(sorters[sortBy]);
  }, [symbolQuery, minVolume, maxBodyPercent, sortBy]);

  const handleScan = () => {
    setScanTime(new Date());
  };

  return (
    <div className="page">
      <div className="hero">
        <p className="tag">Pattern Screener</p>
        <h1>CRT Doji Scanner Pro</h1>
        <p className="subtitle">Advanced scanner inspired by Chartink: filter, rank, and inspect high-probability doji setups in one clean dashboard.</p>
      </div>

      <section className="controls card">
        <div className="control-grid">
          <label>
            Symbol Search
            <input value={symbolQuery} onChange={(e) => setSymbolQuery(e.target.value)} placeholder="e.g. NAS100 / AAPL" />
          </label>
          <label>
            Min Volume
            <input type="number" value={minVolume} onChange={(e) => setMinVolume(Number(e.target.value || 0))} />
          </label>
          <label>
            Max Body % of Candle
            <input type="number" value={maxBodyPercent} min={1} max={30} onChange={(e) => setMaxBodyPercent(Number(e.target.value || 1))} />
          </label>
          <label>
            Sort By
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="score">Doji Score</option>
              <option value="volume">Volume</option>
              <option value="symbol">Symbol</option>
            </select>
          </label>
        </div>

        <div className="toolbar">
          <button onClick={handleScan}>Run Smart Scan</button>
          <span className="muted">
            {scanTime ? `Last scan: ${scanTime.toLocaleTimeString()}` : "No scan yet"}
          </span>
          <span className="pill">Matches: {results.length}</span>
        </div>
      </section>

      <section className="card table-card">
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Type</th>
              <th>Doji Score</th>
              <th>O/H/L/C</th>
              <th>Body %</th>
              <th>Volume</th>
              <th>Day Change</th>
            </tr>
          </thead>
          <tbody>
            {results.map((stock) => (
              <tr key={stock.symbol}>
                <td>{stock.symbol}</td>
                <td>{stock.type}</td>
                <td>{stock.score.toFixed(1)}</td>
                <td>{`${stock.open} / ${stock.high} / ${stock.low} / ${stock.close}`}</td>
                <td>{stock.bodyPercent.toFixed(2)}%</td>
                <td>{stock.volume.toLocaleString()}</td>
                <td className={stock.changePct >= 0 ? "up" : "down"}>{stock.changePct > 0 ? "+" : ""}{stock.changePct.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!results.length && <p className="empty">No setups found. Relax filter rules and run scan again.</p>}
      </section>
    </div>
  );
}
