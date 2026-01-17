import { useEffect, useState } from "react";
import { fetchCRT } from "../api/crtApi";

export default function CRTScreener() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCRT()
      .then(res => {
        setData(res.results);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {data.map((item, i) => (
        <div key={i}>
          <h3>{item.symbol}</h3>
          <p>{item.crt_type} – {item.direction}</p>
          <p>Entry: {item.entry} | SL: {item.sl} | Target: {item.target}</p>
          <p>Grade: {item.grade}</p>
        </div>
      ))}
    </div>
  );
}
