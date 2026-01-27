import { useState } from "react";
import { scanCRT } from "@/lib/api";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runScan = async () => {
    setLoading(true);
    try {
      const result = await scanCRT("NAS100", "15m");
      setData(result);
    } catch (err) {
      alert("API error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>CRT Scanner</h1>

      <button onClick={runScan}>
        {loading ? "Scanning..." : "Scan CRT"}
      </button>

      {data && (
        <pre style={{ marginTop: 20 }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </main>
  );
}
