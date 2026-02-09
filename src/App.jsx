import { useMemo, useState } from "react";

const DEFAULT_SYMBOL = "NAS100";
const DEFAULT_TIMEFRAME = "15m";

const FALLBACK_DATA = [
  { symbol: "AAPL", open: 188.1, high: 190.25, low: 186.96, close: 188.23, volume: 52340000 },
  { symbol: "MSFT", open: 414.3, high: 416.1, low: 410.82, close: 414.31, volume: 21780000 },
  { symbol: "NVDA", open: 712.3, high: 725.4, low: 707.2, close: 711.9, volume: 49210000 },
  { symbol: "AMZN", open: 178.2, high: 179.9, low: 176.4, close: 178.05, volume: 38140000 },
  { symbol: "TSLA", open: 225.1, high: 231.7, low: 224.5, close: 225.17, volume: 66180000 },
  { symbol: "META", open: 492.5, high: 496.1, low: 487.6, close: 492.58, volume: 18420000 },
  { symbol: "AMD", open: 164.2, high: 167.3, low: 162.4, close: 164.22, volume: 43220000 },
  { symbol: "GOOGL", open: 164.1, high: 165.2, low: 162.8, close: 163.92, volume: 25360000 },
];

const API_BASE = import.meta.env.VITE_API_URL || "";

const rules = [
  "abs(close - open) <= (high - low) * 0.1",
  "upper_wick >= body * 1.5",
  "lower_wick >= body * 1.5",
  "volume >= min_volume",
];

function n(v) {
  const num = Number(v);
  return Number.isFinite(num) ? num : 0;
}

function bodySize(candle) {
  return Math.abs(n(candle.open) - n(candle.close));
}

function fullRange(candle) {
  return Math.max(0, n(candle.high) - n(candle.low));
}

function upperWick(candle) {
  return Math.max(0, n(candle.high) - Math.max(n(candle.open), n(candle.close)));
}

function lowerWick(candle) {
  return Math.max(0, Math.min(n(candle.open), n(candle.close)) - n(candle.low));
}

function dojiScore(candle) {
  const range = fullRange(candle);
  if (!range) return 0;
  const bodyRatio = bodySize(candle) / range;
  const wickBalance = 1 - Math.abs(upperWick(candle) - lowerWick(candle)) / range;
  return Math.max(0, Math.min(100, (1 - bodyRatio) * 70 + wickBalance * 30));
}

function dojiType(candle) {
  const up = upperWick(candle);
  const down = lowerWick(candle);
  const body = bodySize(candle);
  if (body <= 0.15 && up > 1.5 * body && down > 1.5 * body) return "Long-Legged";
  if (up > down * 2) return "Gravestone";
  if (down > up * 2) return "Dragonfly";
  return "Neutral";
}

function normalizeRows(payload) {
  const rows = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.results)
      ? payload.results
      : Array.isArray(payload?.data)
        ? payload.data
        : [];

  return rows
    .map((r, i) => ({
      symbol: (r.symbol || r.ticker || `ROW-${i + 1}`).toString().toUpperCase(),
      open: n(r.open),
      high: n(r.high),
      low: n(r.low),
      close: n(r.close),
      volume: n(r.volume),
    }))
    .filter((r) => r.high >= r.low && r.symbol);
}

export default function App() {
  const [symbol, setSymbol] = useState(DEFAULT_SYMBOL);
  const [timeframe, setTimeframe] = useState(DEFAULT_TIMEFRAME);
  const [minVolume, setMinVolume] = useState(5000000);
  const [maxBodyPercent, setMaxBodyPercent] = useState(12);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("score");
  const [rows, setRows] = useState(FALLBACK_DATA);
  const [source, setSource] = useState("mock");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastScan, setLastScan] = useState(null);

  const resultRows = useMemo(() => {
    const mapped = rows.map((row) => {
      const range = fullRange(row);
      const bodyPercent = range ? (bodySize(row) / range) * 100 : 0;
      const changePct = row.open ? ((row.close - row.open) / row.open) * 100 : 0;
      return {
        ...row,
        score: dojiScore(row),
        bodyPercent,
        type: dojiType(row),
        changePct,
      };
    });

    const filtered = mapped.filter((row) => {
      const symbolMatch = row.symbol.toLowerCase().includes(query.toLowerCase());
      return symbolMatch && row.volume >= minVolume && row.bodyPercent <= maxBodyPercent;
    });

    const sorter = {
      score: (a, b) => b.score - a.score,
      volume: (a, b) => b.volume - a.volume,
      symbol: (a, b) => a.symbol.localeCompare(b.symbol),
    }[sortBy];

    return [...filtered].sort(sorter);
  }, [rows, query, minVolume, maxBodyPercent, sortBy]);

  const kpis = useMemo(() => {
    const top = resultRows[0];
    const avgScore = resultRows.length
      ? resultRows.reduce((acc, r) => acc + r.score, 0) / resultRows.length
      : 0;
    return {
      matches: resultRows.length,
      topSymbol: top?.symbol || "-",
      avgScore,
    };
  }, [resultRows]);

  const runScan = async () => {
    setLoading(true);
    setError("");

    if (!API_BASE) {
      setRows(FALLBACK_DATA);
      setSource("mock");
      setLastScan(new Date());
      setLoading(false);
      return;
    }

    try {
      const url = `${API_BASE}/screener/doji?symbol=${encodeURIComponent(symbol)}&timeframe=${encodeURIComponent(timeframe)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const payload = await res.json();
      const normalized = normalizeRows(payload);
      if (!normalized.length) throw new Error("No candle data in API response");
      setRows(normalized);
      setSource("live");
      setLastScan(new Date());
    } catch (e) {
      setRows(FALLBACK_DATA);
      setSource("mock");
      setError(`Live scan failed (${e.message}). Showing demo data.`);
      setLastScan(new Date());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="hero">
        <p className="tag">Chartink-inspired scanner</p>
        <h1>CRT Doji Screener Dashboard</h1>
        <p className="subtitle">Scan, filter and rank potential doji setups with live API mode + offline fallback.</p>
      </header>

      <section className="card scan-panel">
        <div className="scan-grid">
          <label>Symbol<input value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} /></label>
          <label>Timeframe
            <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
              <option>5m</option><option>15m</option><option>1h</option><option>4h</option><option>1d</option>
            </select>
          </label>
          <label>Filter Symbol<input value={query} onChange={(e) => setQuery(e.target.value.toUpperCase())} placeholder="AAPL" /></label>
          <label>Min Volume<input type="number" value={minVolume} onChange={(e) => setMinVolume(n(e.target.value))} /></label>
          <label>Max Candle Body %<input type="number" value={maxBodyPercent} min={1} max={30} onChange={(e) => setMaxBodyPercent(n(e.target.value))} /></label>
          <label>Sort
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="score">Doji score</option>
              <option value="volume">Volume</option>
              <option value="symbol">Symbol</option>
            </select>
          </label>
        </div>

        <div className="toolbar">
          <button onClick={runScan} disabled={loading}>{loading ? "Scanning..." : "Run Smart Scan"}</button>
          <span className="muted">Source: {source === "live" ? "Live API" : "Demo fallback"}</span>
          <span className="muted">{lastScan ? `Last scan ${lastScan.toLocaleTimeString()}` : "Not scanned yet"}</span>
        </div>
        {error ? <p className="warn">{error}</p> : null}
      </section>

      <section className="kpi-grid">
        <article className="card kpi"><p>Matches</p><strong>{kpis.matches}</strong></article>
        <article className="card kpi"><p>Top symbol</p><strong>{kpis.topSymbol}</strong></article>
        <article className="card kpi"><p>Avg score</p><strong>{kpis.avgScore.toFixed(1)}</strong></article>
      </section>

      <section className="card rules">
        <h3>Scan logic</h3>
        <ul>
          {rules.map((rule) => <li key={rule}><code>{rule}</code></li>)}
        </ul>
      </section>

      <section className="card table-wrap">
        <table>
          <thead><tr><th>Symbol</th><th>Type</th><th>Score</th><th>OHLC</th><th>Body %</th><th>Volume</th><th>Change %</th></tr></thead>
          <tbody>
            {resultRows.map((row) => (
              <tr key={row.symbol}>
                <td>{row.symbol}</td>
                <td>{row.type}</td>
                <td>{row.score.toFixed(1)}</td>
                <td>{row.open.toFixed(2)} / {row.high.toFixed(2)} / {row.low.toFixed(2)} / {row.close.toFixed(2)}</td>
                <td>{row.bodyPercent.toFixed(2)}%</td>
                <td>{row.volume.toLocaleString()}</td>
                <td className={row.changePct >= 0 ? "up" : "down"}>{row.changePct > 0 ? "+" : ""}{row.changePct.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!resultRows.length ? <p className="empty">No setups with current filters.</p> : null}
      </section>
    </div>
  );
}
