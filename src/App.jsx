import { useEffect, useState } from "react";

export default function App() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch("https://crt-screener-backend.onrender.com/screener/doji")
      .then(res => res.json())
      .then(data => {
        console.log("DATA:", data);
        setRows(data);
      })
      .catch(err => console.error("ERROR:", err));
  }, []);

  return (
    <div style={{ padding: 20, color: "white" }}>
      <h1>CRT Screener</h1>

      {rows.length === 0 && <p>No data loaded</p>}

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.symbol}</td>
              <td>{r.open}</td>
              <td>{r.high}</td>
              <td>{r.low}</td>
              <td>{r.close}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
