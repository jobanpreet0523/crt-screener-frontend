import { useState, useEffect, useCallback } from "react";
import {
  fetchStatus, fetchIndices, fetchQuote,
  fetchScan, fetchCRT, fetchStock, fetchAI, fetchFinancials
} from "./api";
import Screener   from "./components/Screener";
import StockDetail from "./components/StockDetail";
import AIResearch  from "./components/AIResearch";
import styles      from "./App.module.css";

const TABS = [
  { id: "screener",  label: "📊 Screener" },
  { id: "crt",       label: "🎯 CRT Scan" },
  { id: "search",    label: "🔍 Stock Lookup" },
  { id: "ai",        label: "🤖 AI Research" },
];

const TICKER_SYMS = "RELIANCE,TCS,HDFCBANK,INFY,ICICIBANK,SBIN,WIPRO,AXISBANK,TATAMOTORS,ITC,LT,MARUTI,TITAN";

export default function App() {
  const [tab,      setTab]     = useState("screener");
  const [mktOpen,  setMktOpen] = useState(null);
  const [istTime,  setIstTime] = useState("");
  const [indices,  setIndices] = useState(null);
  const [ticker,   setTicker]  = useState([]);
  const [backendOk,setBackend] = useState(null);

  // ── check backend + market status ──────────────────────────
  useEffect(() => {
    fetchStatus()
      .then(d => { setMktOpen(d.market_open); setIstTime(d.ist_time); setBackend(true); })
      .catch(()  => setBackend(false));
    fetchIndices()
      .then(d => setIndices(d))
      .catch(()  => {});
    fetchQuote(TICKER_SYMS, "NSE")
      .then(d => setTicker(d.quotes || []))
      .catch(()  => {});
  }, []);

  // IST clock update
  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
      setIstTime(now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }));
      const h = now.getHours(), m = now.getMinutes(), wd = now.getDay();
      setMktOpen(wd >= 1 && wd <= 5 && (h > 9 || (h === 9 && m >= 15)) && (h < 15 || (h === 15 && m <= 30)));
    }, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.app}>
      {/* ── BACKGROUND ── */}
      <div className={styles.bgMotion} />

      {/* ── TOP NAV ── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.logo}>Stock<span>Research</span></span>
          <nav className={styles.nav}>
            {TABS.map(t => (
              <button
                key={t.id}
                className={`${styles.navBtn} ${tab === t.id ? styles.navActive : ""}`}
                onClick={() => setTab(t.id)}
              >{t.label}</button>
            ))}
          </nav>
        </div>

        <div className={styles.headerRight}>
          {indices && (
            <div className={styles.indexBar}>
              {indices.nifty50 && (
                <span>
                  NIFTY <b>{indices.nifty50.price.toLocaleString("en-IN")}</b>{" "}
                  <span className={indices.nifty50.change >= 0 ? styles.up : styles.dn}>
                    {indices.nifty50.change >= 0 ? "▲" : "▼"}{Math.abs(indices.nifty50.change)}%
                  </span>
                </span>
              )}
              {indices.sensex && (
                <span>
                  SENSEX <b>{indices.sensex.price.toLocaleString("en-IN")}</b>{" "}
                  <span className={indices.sensex.change >= 0 ? styles.up : styles.dn}>
                    {indices.sensex.change >= 0 ? "▲" : "▼"}{Math.abs(indices.sensex.change)}%
                  </span>
                </span>
              )}
            </div>
          )}
          <span className={`${styles.mktPill} ${mktOpen ? styles.mktOpen : styles.mktClosed}`}>
            ⬤ {mktOpen ? "Market Open" : "Market Closed"}
          </span>
          <span className={styles.mktTime}>{istTime} IST</span>
          {backendOk === false && (
            <span className={styles.backendWarn}>⚠ Backend Offline</span>
          )}
        </div>
      </header>

      {/* ── TICKER BAR ── */}
      {ticker.length > 0 && (
        <div className={styles.tickerBar}>
          <div className={styles.tickerTrack}>
            {[...ticker, ...ticker].map((q, i) => (
              <span key={i} className={styles.tickItem}>
                <b>{q.symbol}</b>
                <span> ₹{q.price?.toFixed(2)}</span>
                <span className={q.change >= 0 ? styles.up : styles.dn}>
                  {" "}{q.change >= 0 ? "+" : ""}{q.change?.toFixed(2)}%
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── MAIN ── */}
      <main className={styles.main}>
        {tab === "screener" && <Screener />}
        {tab === "crt"      && <Screener crtMode />}
        {tab === "search"   && <StockDetail />}
        {tab === "ai"       && <AIResearch />}
      </main>
    </div>
  );
}
