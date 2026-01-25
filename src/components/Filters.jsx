import { useState } from "react";

export default function Filters({ onScan }) {
  const [minPrice, setMinPrice] = useState(100);
  const [minVolume, setMinVolume] = useState(500000);

  const submit = () => {
    onScan({
      min_price: minPrice,
      min_volume: minVolume,
      model: "CRT"
    });
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <input
        type="number"
        placeholder="Min Price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Min Volume"
        value={minVolume}
        onChange={(e) => setMinVolume(e.target.value)}
      />
      <button onClick={submit}>🔍 Scan</button>
    </div>
  );
}
