import { useEffect, useState } from "react";
import { fetchCrtScan } from "../api/crtApi";

export default function CrtTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCrtScan("NIFTY", "15m")
      .then(res => {
        setData(res.results);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading CRT setups...</p>;

  return (
    <table border="1" cellPadding="8">
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Direction</th>
          <th>CRT</th>
          <th>Entry</th>
          <th>SL</th>
          <th>Target</th>
          <th>Grade</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            <td>{row.symbol}</td>
            <td>{row.direction}</td>
            <td>{row.crt_type}</td>
            <td>{row.entry}</td>
            <td>{row.sl}</td>
            <td>{row.target}</td>
            <td>{row.grade}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
