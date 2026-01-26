const canvas = document.getElementById("brain");
const ctx = canvas.getContext("2d");

canvas.width = 420;
canvas.height = 420;

let signal = "NONE";
let pulseSpeed = 0.02;

// Nodes inside brain
const nodes = [];
const NODE_COUNT = 60;

for (let i = 0; i < NODE_COUNT; i++) {
  nodes.push({
    x: Math.random() * 260 - 130,
    y: Math.random() * 300 - 150,
    phase: Math.random() * Math.PI * 2
  });
}

// MAIN DRAW LOOP
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);

  // Brain outline
  ctx.strokeStyle = "#1f2b4d";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, 150, 180, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Corpus Callosum
  ctx.strokeStyle = "#00ffcc";
  ctx.shadowBlur = 20;
  ctx.shadowColor = "#00ffcc";
  ctx.beginPath();
  ctx.moveTo(-30, 0);
  ctx.bezierCurveTo(-10, -10, 10, 10, 30, 0);
  ctx.stroke();

  ctx.shadowBlur = 0;

  // Nodes + pulses
  nodes.forEach(n => {
    n.phase += pulseSpeed;
    const px = n.x + Math.sin(n.phase) * 4;
    const py = n.y + Math.cos(n.phase) * 4;

    ctx.beginPath();
    ctx.fillStyle = signal === "A+" ? "#00ff88" : "#4aa3ff";
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
  requestAnimationFrame(draw);
}

draw();

// GLOBAL SIGNAL FUNCTION (HTML → JS)
window.setSignal = function(type) {
  signal = type;

  const el = document.getElementById("signal");
  el.textContent = type;

  if (type === "A+") {
    el.style.color = "#00ff88";
    pulseSpeed = 0.08;
  } else if (type === "VALID") {
    el.style.color = "#ffaa00";
    pulseSpeed = 0.04;
  } else {
    el.style.color = "#ff5555";
    pulseSpeed = 0.02;
  }
};
