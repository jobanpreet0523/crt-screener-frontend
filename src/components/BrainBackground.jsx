import { useEffect, useRef } from "react";

export default function BrainBackground({
  signalStrength = 0,
  isAPlus = false,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const cx = w / 2;
    const cy = h / 2;

    const rx = w * 0.22;
    const ry = h * 0.34;

    // ---- Brain lobes ----
    const insideLeft = (x, y) =>
      ((x - (cx - rx * 0.55)) ** 2) / rx ** 2 +
        ((y - cy) ** 2) / ry ** 2 <
      1;

    const insideRight = (x, y) =>
      ((x - (cx + rx * 0.55)) ** 2) / rx ** 2 +
        ((y - cy) ** 2) / ry ** 2 <
      1;

    const insideBrain = (x, y) => insideLeft(x, y) || insideRight(x, y);

    // ---- Nodes ----
    const nodes = [];
    while (nodes.length < 140) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      if (insideBrain(x, y)) {
        nodes.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          lobe: insideLeft(x, y) ? "L" : "R",
        });
      }
    }

    let tick = 0;

    function drawCorpusCallosum() {
      const glow = 0.3 + signalStrength * 0.7;
      ctx.beginPath();
      ctx.moveTo(cx - 40, cy);
      ctx.lineTo(cx + 40, cy);
      ctx.strokeStyle = `rgba(180,220,255,${glow})`;
      ctx.lineWidth = 6;
      ctx.shadowBlur = 20;
      ctx.shadowColor = "rgba(180,220,255,0.8)";
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);

      // Flash on A+
      if (isAPlus) {
        ctx.fillStyle = "rgba(180,220,255,0.08)";
        ctx.fillRect(0, 0, w, h);
      }

      drawCorpusCallosum();

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
        ctx.fillStyle = n.lobe === "L" ? "#8ab4ff" : "#9cf0ff";
        ctx.fill();

        // Connections + pulses
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const d = Math.hypot(n.x - m.x, n.y - m.y);

          if (d < 115) {
            ctx.strokeStyle = "rgba(140,190,255,0.25)";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();

            if (n.lobe !== m.lobe && (i + j + tick) % 140 === 0) {
              const speed = 40 - signalStrength * 30;
              const t = (tick % speed) / speed;

              const px = n.x + (m.x - n.x) * t;
              const py = n.y + (m.y - n.y) * t;

              ctx.beginPath();
              ctx.arc(px, py, 3.2, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(210,235,255,0.95)";
              ctx.fill();
            }
          }
        }
      });

      tick++;
      requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("resize", () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, [signalStrength, isAPlus]);

  return <canvas ref={canvasRef} className="brain-canvas" />;
}
