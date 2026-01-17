import { fetchCRTResults } from "../services/api";
import { useState } from "react";

function CRTScreener() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runScan = async (filters) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchCRTResults(filters);
      setResults(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Scanner onScan={runScan} />

      {loading && <p>Scanning market...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ResultsTable data={results} />
    </>
  );
}
