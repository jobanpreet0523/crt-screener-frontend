export default function App() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>CRT Desk</h2>

        <div className="nav-item active">Live Scanner</div>
        <div className="nav-item">HTF Bias</div>
        <div className="nav-item">Liquidity Map</div>
        <div className="nav-item">Settings</div>
      </aside>

      <main className="main">
        <div className="header">
          <h1>CRT Screener Live</h1>
          <p>Institutional time-based setups</p>
        </div>

        <div className="card table-card">
          <div className="table-title">Live Market Signals</div>

          <table className="table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Timeframe</th>
                <th>Bias</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ES</td>
                <td>5M</td>
                <td>Bullish</td>
                <td className="status-long">LONG</td>
              </tr>

              <tr>
                <td>NQ</td>
                <td>15M</td>
                <td>Bearish</td>
                <td className="status-short">SHORT</td>
              </tr>

              <tr>
                <td>EURUSD</td>
                <td>1H</td>
                <td>Neutral</td>
                <td className="status-wait">WAIT</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
