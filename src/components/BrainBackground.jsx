import { useEffect, useRef } from "react";

export default function BrainBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const cx = w / 2;
    const cy = h / 2;

    // Left & Right brain lobes (two overlapping ellipses)
    function insideLeftBrain(x, y) {
      const rx = w * 0.22;
      const ry = h * 0.34;
      return (
        ((x - (cx - rx * 0.55)) ** 2) / rx ** 2 +
          ((y - cy) ** 2) / ry ** 2 <
        1
      );
    }

    function insideRightBrain(x, y) {
      const rx = w * 0.22;
      const ry = h * 0.34;
      return (
        ((x - (cx + rx * 0.55)) ** 2) / rx ** 2 +
          ((y - cy) ** 2) / ry ** 2 <
        1
      );
    }

    function insideBrain(x, y) {
      return insideLeftBrain(x, y) || insideRightBrain(x, y);
    }

    // Create nodes
    const nodes = [];
    while (nodes.length < 130) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      if (insideBrain(x, y)) {
        nodes.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          lobe: insideLeftBrain(x, y) ? "L" : "R",
        });
      }
    }

    let pulseTick = 0;

    function animate() {
      ctx.clearRect(0, 0, w, h);

      nodes.forEach((n, i) => {
        n.x += n.vx;
        n.y += n.vy;

        if (!insideBrain(n.x, n.y)) {
          n.vx *= -1;
          n.vy *= -1;
        }

        // Node
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle =
          n.lobe === "L" ? "#8ab4ff" : "#9cf0ff";
        ctx.fill();

        // Connections
        for (let j = i + 1; j < nodes.length; j++)
