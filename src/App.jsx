import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://crt-screener-backend-1.onrender.com/scan/nse200")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ color: "white" }}>Scanning NSE 200...</div>;
  }

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ color: "#22c55e" }}>CRT Screener – NSE 200</h1>

      <table style={{ width: "100%", color: "white", marginTop: "20px" }}>
        <thead>
          <tr>
            <th align="left">Symbol</th>
            <th align="left">Timeframe</th>
            <th align="left">Setup</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>{row.symbol}</td>
              <td>{row.timeframe}</td>
              <td>
                <span style={{ color: "#38bdf8" }}>{row.setup}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
