import React from "react";
import { useState } from "react";
import { scanMarket } from "../api";
import ResultsTable from "./ResultsTable";

export default function Scanner() {
  const [tf, setTf] = useState("daily");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  async function runScan() {
    setLoading(true);
    const res = await scanMarket(tf);
    setData(res.results || []);
    setLoading(false);
  }

  return (
    <>
      <div className="controls">
        <select value={tf} onChange={e => setTf(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <button onClick={runScan}>Run Scan</button>
      </div>

      {loading && <p>Scanning market...</p>}
      <ResultsTable data={data} />
    </>
  );
}
