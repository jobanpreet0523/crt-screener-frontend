import { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://crt-screener-backend.onrender.com/screener/doji")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <h1>CRT Screener</h1>

      {loading && <p>Scanning NSE Stocks...</p>}

      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>CRT</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>{row.symbol}</td>
              <td>DOJI</td>
              <td>{row.open}</td>
              <td>{row.high}</td>
              <td>{row.low}</td>
              <td>{row.close}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
