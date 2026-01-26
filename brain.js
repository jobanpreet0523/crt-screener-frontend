const canvas = document.getElementById("brain");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let nodes = [];
let signalStrength = 1;
let flash = false;

// --- Brain shape function ---
function brainPoint(i, side) {
  const angle = i * 0.3;
  const x =
    canvas.width / 2 +
    side * (220 + Math.sin(angle * 2) * 30) * Math.cos(angle);
  const y =
    canvas.height / 2 +
    (140 + Math.cos(angle * 3) * 20) * Math.sin(angle);
  return { x, y };
}

// --- Create nodes ---
for (let i = 0; i < 90; i++) {
  nodes.push({ ...brainPoint(i, -1), pulse: Math.random() * 100 });
  nodes.push({ ...brainPoint(i, 1), pulse: Math.random() * 100 });
}

// --- Animation loop ---
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // connections
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 90) {
        ctx.strokeStyle = `rgba(0,180,255,${0.15 * signalStrength})`;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }

  // corpus callosum glow
  ctx.strokeStyle = `rgba(0,220,255,${0.4 * signalStrength})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, canvas.height / 2 - 120);
  ctx.lineTo(canvas.width / 2, canvas.height / 2 + 120);
  ctx.stroke();

  // nodes
  nodes.forEach(n => {
    n.pulse += 0.5 * signalStrength;
    const r = 2 + Math.sin(n.pulse * 0.1) * 1.5;

    ctx.fillStyle = flash
      ? "rgba(255,255,255,0.9)"
      : "rgba(0,200,255,0.8)";

    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    ctx.fill();
  });

  flash = false;
  requestAnimationFrame(draw);
}

draw();

// --- Signal control ---
function setSignal(type) {
  if (type === "Weak") signalStrength = 0.5;
  if (type === "Valid") signalStrength = 1;
  if (type === "A+") {
    signalStrength = 2;
    flash = true;
  }
}
