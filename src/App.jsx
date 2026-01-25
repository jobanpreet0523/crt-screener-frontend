export default function App() {
  return (
    <div className="app">
      <h1>CRT Screener</h1>
      <p>Professional Trading Dashboard</p>

      <div className="cards">
        <div className="glass-card">
          <h3>NIFTY</h3>
          <span className="badge aplus">A+</span>
          <p>Bullish CRT</p>
        </div>

        <div className="glass-card">
          <h3>BANKNIFTY</h3>
          <span className="badge a">A</span>
          <p>Liquidity Sweep</p>
        </div>

        <div className="glass-card">
          <h3>FINNIFTY</h3>
          <span className="badge b">B</span>
          <p>Range Setup</p>
        </div>
      </div>
    </div>
  );
}
