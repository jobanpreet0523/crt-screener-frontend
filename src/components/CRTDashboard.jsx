import { useEffect, useState } from "react";
import CrtTable from "./CrtTable";

const API_URL = "https://crt-screener-backend.onrender.com/api/crt-scan";

export default function CRTDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error("API error");
        }
        return res.json();
      })
      .then((json) => {
        setData(json.results || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load CRT data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p style={{ padding: "20px" }}>🔄 Scanning market...</p>;
  }

  if (error) {
    return <p style={{ padding: "20px", color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 CRT Screener Dashboard</h2>
      <CrtTable data={data} />
    </div>
  );
}
