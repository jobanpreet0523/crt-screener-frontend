import { useState } from "react";
import Filters from "./components/Filters";
import ResultsTable from "./components/ResultsTable";

export default function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const runScan = async (filters) => {
    setLoading(true);
    const res = await fetch(import.meta.env.VITE_API_URL + "/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters),
    });
    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📊 CRT Screener</h1>
      <Filters onScan={runScan} />
      {loading ? <p>Scanning...</p> : <ResultsTable data={results} />}
    </div>
  );
}
