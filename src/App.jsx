import { useEffect, useRef } from "react";
import "./index.css";

export default function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let t = 0;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(0, 180, 255, 0.6)";
      ctx.beginPath();

      for (let i = 0; i < 120; i++) {
        const x =
          canvas.width / 2 +
          Math.cos(i * 0.3 + t) * 250 +
          Math.sin(t) * 40;
        const y =
          canvas.height / 2 +
          Math.sin(i * 0.3 + t) * 120;

        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = "rgba(0,180,255,0.35)";
      ctx.stroke();

      t += 0.02;
      requestAnimationFrame(draw);
    }

    draw();

  }, []); // ✅ THIS LINE FIXES EVERYTHING

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
      }}
    />
  );
}
