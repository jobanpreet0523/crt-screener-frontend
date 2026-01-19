import { useEffect, useState } from "react";
import { getDojiStocks } from "./api";

export default function DojiTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getDojiStocks().then(setData);
  }, []);

  return (
    <div>
      <h2>CRT Doji Screener</h2>
      <table border="1">
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
          {data.map((s, i) => (
            <tr key={i}>
              <td>{s.symbol}</td>
              <td>{s.open}</td>
              <td>{s.high}</td>
              <td>{s.low}</td>
              <td>{s.close}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
