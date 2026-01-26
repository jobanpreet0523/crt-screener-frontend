import { useState } from "react";
import BrainBackground from "./components/BrainBackground";

function App() {
  // 🔧 These will later come from REAL CRT logic
  const [signalStrength, setSignalStrength] = useState(0.35);
  const [isAPlus, setIsAPlus] = useState(false);

  // 🔁 Temporary test controls (safe to remove later)
  function simulateWeak() {
    setSignalStrength(0.35);
    setIsAPlus(false);
  }

  function simulateValid() {
    setSignalStrength(0.65);
    setIsAPlus(false);
  }

  function simulateAPlus() {
    setSignalStrength(0.9);
    setIsAPlus(true);
    setTimeout(() => setIsAPlus(false), 900); // flash once
  }

  return (
    <>
      {/* 🧠 Brain Intelligence Layer */}
      <BrainBackground
        signalStrength={signalStrength}
        isAPlus={isAPlus}
      />

      {/* 🧩 Your CRT UI */}
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
          textAlign: "center",
        }}
      >
        <h1>CRT Screener</h1>
        <p>Institutional-grade execution intelligence</p>

        {/* 🔧 Temporary testing buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={simulateWeak}>Weak</button>
          <button onClick={simulateValid}>Valid</button>
          <button onClick={simulateAPlus}>A+</button>
        </div>
      </main>
    </>
  );
}

export default App;
