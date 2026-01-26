import { useEffect, useRef } from "react";

export default function BrainBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    // Brain mask (ellipse-based brain shape)
    function insideBrain(x, y) {
      const cx = w / 2;
      const cy = h / 2;
      const rx = w * 0.28;
      const ry = h * 0.38;
      return (
        ((x - cx) ** 2) / rx ** 2 +
          ((y - cy) ** 2) / ry ** 2 <
        1
      );
    }

    // Nodes
    const nodes = [];
    while (nodes.length < 110) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      if (insideBrain(x, y)) {
        nodes.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
        });
      }
    }

    let pulseIndex = 0;

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
        ctx.fillStyle = "#8ab4ff";
        ctx.fill();

        // Connections
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const d = Math.hypot(n.x - m.x, n.y - m.y);

          if (d < 110) {
            const alpha = 1 - d / 110;
            ctx.strokeStyle = `rgba(120,170,255,${alpha * 0.35})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();

            // Signal pulse
            if ((i + j + pulseIndex) % 140 === 0) {
              const t = (pulseIndex % 60) / 60;
              const px = n.x + (m.x - n.x) * t;
              const py = n.y + (m.y - n.y) * t;

              ctx.beginPath();
              ctx.arc(px, py, 2.6, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(170,210,255,0.9)";
              ctx.fill();
            }
          }
        }
      });

      pulseIndex++;
      requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("resize", () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    return () => window.removeEventListener("resize", () => {});
  }, []);

  return <canvas ref={canvasRef} className="brain-canvas" />;
}
