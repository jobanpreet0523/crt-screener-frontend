import { useEffect, useRef, useState } from "react";
import "./index.css";

export default function App() {
  const canvasRef = useRef(null);
  const [crtGrade, setCrtGrade] = useState("valid"); // weak | valid | A+

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // 🔹 Pulse speed tied to CRT grade
    const pulseSpeed =
      crtGrade === "A+" ? 2.2 : crtGrade === "valid" ? 1.2 : 0.6;

    // 🔹 Brain nodes
    const nodes = [];
    const nodeCount = 140;

    for (let i = 0; i < nodeCount; i++) {
      const side = i < nodeCount / 2 ? -1 : 1; // left / right lobe
      nodes.push({
        x:
          centerX +
          side * (120 + Math.random() * 180) +
          Math.random() * 40,
        y: centerY + (Math.random() - 0.5) * 260,
        r: Math.random() * 2 + 1,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let t = 0;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 🧠 A+ FLASH
      if (crtGrade === "A+" && Math.sin(t * 0.05) > 0.92) {
        ctx.fillStyle = "rgba(120,180,255,0.12)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 🔹 Draw connections
      nodes.forEach((a, i) => {
        nodes.forEach((b, j) => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.strokeStyle = "rgba(140,180,255,0.15)";
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        });
      });

      // 🔹 Corpus Callosum (center bridge)
      ctx.strokeStyle = "rgba(180,220,255,0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - 40, centerY);
      ctx.lineTo(centerX + 40, centerY);
      ctx.stroke();

      // 🔹 Nodes + signal pulse
      nodes.forEach((n) => {
        const pulse = Math.sin(t * pulseSpeed + n.phase) * 1.5;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + pulse, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200,230,255,0.9)";
        ctx.fill();
            t += 0.02;
      requestAnimationFrame(draw);
    }

    draw();

