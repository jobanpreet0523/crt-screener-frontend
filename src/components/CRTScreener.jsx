import { useEffect, useState } from "react";
import { fetchCRT } from "../api/crtApi";

export default function CRTScreener() {
  const [data, setData] = useState([]);
  const [tf, setTf] = useState("daily");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [tf]);

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetchCRT(tf);
      setData(res.results);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <div>
      <h2>CRT Screener</h2>

      <select value={tf} onChange={e => setTf(e.target.value)}>
        <option value="daily">Daily</option>
        <option value="4h">4H</option>
        <option value="1h">1H</option>
      </select>

      {loading && <p>Scanning markets...</p>}

      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>CRT Bias</th>
            <th>Timeframe</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>{row.symbol}</td>
              <td>{row.crt}</td>
              <td>{row.timeframe}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
