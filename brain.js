// brain.js
const canvas = document.getElementById("brain");
const ctx = canvas.getContext("2d");

let signal = "NONE";
let pulse = 0;
let flash = 0;

// === FUTURE API READY ===
// replace later with fetch("/api/crt")
function getLiveCRTSignal() {
  return signal; // WEAK | VALID | A+
}

window.setSignal = (s) => {
  signal = s;
  document.getElementById("status").innerText = s;
  if (s === "A+") flash = 18;
};

function drawLobe(side) {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const offset = side === "left" ? -110 : 110;

  ctx.beginPath();
  ctx.ellipse(cx + offset, cy, 120, 160, 0, 0, Math.PI * 2);
  ctx.fillStyle = lobeColor();
  ctx.shadowBlur = 30;
  ctx.shadowColor = lobeColor();
  ctx.fill();
}

function drawCorpusCallosum() {
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 60, canvas.height / 2);
  ctx.lineTo(canvas.width / 2 + 60, canvas.height / 2);
  ctx.lineWidth = 7;
  ctx.strokeStyle = "#6fa8ff";
  ctx.shadowBlur = 25;
  ctx.shadowColor = "#6fa8ff";
  ctx.stroke();
}

function drawPulse() {
  const x = canvas.width / 2 - 60 + (pulse % 120);
  ctx.beginPath();
  ctx.arc(x, canvas.height / 2, 6, 0, Math.PI * 2);
  ctx.fillStyle = "#00ff99";
  ctx.shadowBlur = 20;
  ctx.shadowColor = "#00ff99";
  ctx.fill();
}

function drawFlash() {
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 210, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(0,255,160,0.6)";
  ctx.lineWidth = 6;
  ctx.shadowBlur = 40;
  ctx.shadowColor = "#00ff99";
  ctx.stroke();
}

function lobeColor() {
  if (signal === "A+") return "#00ff99";
  if (signal === "VALID") return "#4aa3ff";
  if (signal === "WEAK") return "#ffb347";
  return "#1f2a4a";
}

function pulseSpeed() {
  if (signal === "A+") return 4.5;
  if (signal === "VALID") return 2.5;
  if (signal === "WEAK") return 1.2;
  return 0.6;
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawLobe("left");
  drawLobe("right");
  drawCorpusCallosum();
  drawPulse();

  if (flash > 0) {
    drawFlash();
    flash--;
  }

  pulse += pulseSpeed();
  requestAnimationFrame(loop);
}

loop();
