import { useEffect, useState } from "react";
import { API } from "./api";

export default function Screener() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/screener/doji").then(res => {
      setData(res.data);
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>📊 Doji Screener (NSE)</h2>

      <table width="100%" border="1" cellPadding="8">
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
          {data.map((row, i) => (
            <tr key={i}>
              <td>{row.symbol}</td>
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
