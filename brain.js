const canvas = document.getElementById("brain");
const ctx = canvas.getContext("2d");

let signal = "NONE";
let pulse = 0;
let flash = 0;
let aPlusHold = 0;
let execLock = false;
let timeframe = "M5"; // future-ready

// ===== API READY =====
function getLiveCRTSignal(){
  return signal;
}

window.setSignal = (s)=>{
  signal = s;
  document.getElementById("status").innerText = s;
  if(s==="A+") flash = 20;
  if(s!=="A+"){ aPlusHold=0; execLock=false; }
};

// ===== UTIL =====
function color(){
  if(execLock) return "#00ff99";
  if(signal==="A+") return "#3cffb0";
  if(signal==="VALID") return "#4aa3ff";
  if(signal==="WEAK") return "#ffb347";
  return "#1f2a4a";
}

function pulseSpeed(){
  const tf = timeframe==="M1"?3: timeframe==="M5"?2:1;
  if(signal==="A+") return 4*tf;
  if(signal==="VALID") return 2*tf;
  if(signal==="WEAK") return 1*tf;
  return .5;
}

// ===== NODE NETWORK =====
function drawNodes(cx,cy,r){
  for(let i=0;i<18;i++){
    const a=Math.random()*Math.PI*2;
    const x=cx+Math.cos(a)*r*Math.random();
    const y=cy+Math.sin(a)*r*Math.random();
    ctx.beginPath();
    ctx.arc(x,y,2,0,Math.PI*2);
    ctx.fillStyle=color();
    ctx.fill();
  }
}

// ===== LOBES =====
function drawLobe(x){
  ctx.beginPath();
  ctx.ellipse(x,canvas.height/2,130,170,0,0,Math.PI*2);
  ctx.fillStyle=color();
  ctx.shadowBlur=25;
  ctx.shadowColor=color();
  ctx.fill();
  drawNodes(x,canvas.height/2,120);
}

// ===== CORPUS CALLOSUM =====
function drawBridge(){
  ctx.beginPath();
  ctx.moveTo(canvas.width/2-70,canvas.height/2);
  ctx.lineTo(canvas.width/2+70,canvas.height/2);
  ctx.lineWidth=8;
  ctx.strokeStyle="#6fa8ff";
  ctx.shadowBlur=25;
  ctx.shadowColor="#6fa8ff";
  ctx.stroke();
}

// ===== PULSE =====
function drawPulse(){
  const x=canvas.width/2-70+(pulse%140);
  ctx.beginPath();
  ctx.arc(x,canvas.height/2,6,0,Math.PI*2);
  ctx.fillStyle="#00ff99";
  ctx.fill();
}

// ===== LIQUIDITY SPIKE =====
function lightning(){
  ctx.beginPath();
  ctx.moveTo(canvas.width/2,canvas.height/2-40);
  ctx.lineTo(canvas.width/2+20,canvas.height/2+10);
  ctx.lineTo(canvas.width/2-15,canvas.height/2+40);
  ctx.strokeStyle="#ffffff";
  ctx.lineWidth=2;
  ctx.shadowBlur=20;
  ctx.shadowColor="#ffffff";
  ctx.stroke();
}

// ===== FLASH =====
function flashRing(){
  ctx.beginPath();
  ctx.arc(canvas.width/2,canvas.height/2,220,0,Math.PI*2);
  ctx.strokeStyle="rgba(0,255,160,.6)";
  ctx.lineWidth=6;
  ctx.stroke();
}

// ===== LOOP =====
function loop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  drawLobe(canvas.width/2-120);
  drawLobe(canvas.width/2+120);
  drawBridge();
  drawPulse();

  if(signal==="VALID" && Math.random()<.01) lightning();
  if(flash>0){ flashRing(); flash--; }

  if(signal==="A+"){
    aPlusHold+=1/60;
    if(aPlusHold>=3) execLock=true;
  }

  pulse+=pulseSpeed();
  requestAnimationFrame(loop);
}

loop();
