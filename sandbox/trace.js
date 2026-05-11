<script>
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = canvas.parentElement.clientWidth;
canvas.height = canvas.parentElement.clientHeight;

ctx.lineWidth = 3;
ctx.lineCap = "round";

let state = "spiral"; // spiral → shape-trace → shape-memory → finished
let stimulus = "spiral";
let drawing = false;
let startTime = null;
let hasDrawnMemory = false;

const data = [];
const shapes = ["square","triangle","circle","star","hash"];
let currentShape = null;

/* ---------------- STIMULI ---------------- */

function drawSpiral() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle = "#bbb";
  ctx.beginPath();
  const cx = canvas.width/2, cy = canvas.height/2;
  for(let t=0; t<8*Math.PI; t+=0.05){
    const r = 2 + 4*t;
    const x = cx + r*Math.cos(t);
    const y = cy + r*Math.sin(t);
    t===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
  }
  ctx.stroke();
}

function drawShape(name){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle="#bbb";
  ctx.beginPath();
  const w=canvas.width, h=canvas.height;

  if(name==="square") ctx.rect(60,60,180,180);
  if(name==="triangle"){
    ctx.moveTo(w/2,40); ctx.lineTo(260,260); ctx.lineTo(40,260); ctx.closePath();
  }
  if(name==="circle") ctx.arc(w/2,h/2,90,0,2*Math.PI);
  if(name==="hash"){
    ctx.moveTo(100,40); ctx.lineTo(100,260);
    ctx.moveTo(200,40); ctx.lineTo(200,260);
    ctx.moveTo(40,100); ctx.lineTo(260,100);
    ctx.moveTo(40,200); ctx.lineTo(260,200);
  }
  if(name==="star"){
    const cx=w/2, cy=h/2, r1=90, r2=40;
    for(let i=0;i<10;i++){
      const r=i%2?r2:r1;
      const a=Math.PI/2+i*Math.PI/5;
      ctx.lineTo(cx+r*Math.cos(a), cy-r*Math.sin(a));
    }
    ctx.closePath();
  }
  ctx.stroke();
}

/* ---------------- DRAWING ---------------- */

function pos(e){
  const r=canvas.getBoundingClientRect();
  const p=e.touches?e.touches[0]:e;
  return {x:p.clientX-r.left,y:p.clientY-r.top};
}

function startDraw(e){
  drawing=true;
  const {x,y}=pos(e);
  ctx.strokeStyle="black";
  ctx.beginPath();
  ctx.moveTo(x,y);
  startTime ??= performance.now();
  record(x,y);
}

function moveDraw(e){
  if(!drawing) return;
  e.preventDefault();
  const {x,y}=pos(e);
  ctx.lineTo(x,y);
  ctx.stroke();
  record(x,y);
}

function stopDraw(){
  drawing=false;
  if(state==="shape-memory") {
    hasDrawnMemory = true;
    document.getElementById("sendBtn").style.display = "block";
  }
}

function record(x,y){
  data.push({
    state,
    stimulus,
    x,y,
    t: performance.now() - startTime
  });
}

canvas.addEventListener("mousedown",startDraw);
canvas.addEventListener("mousemove",moveDraw);
canvas.addEventListener("mouseup",stopDraw);
canvas.addEventListener("touchstart",startDraw);
canvas.addEventListener("touchmove",moveDraw);
canvas.addEventListener("touchend",stopDraw);

/* ---------------- BUTTON LOGIC ---------------- */

const instruction = document.getElementById("instruction");
const nextBtn = document.getElementById("nextBtn");
const sendBtn = document.getElementById("sendBtn");

function updateUI(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  startTime=null;

  if(state==="spiral"){
    instruction.innerText="Trace the spiral";
    stimulus="spiral";
    drawSpiral();
    nextBtn.style.display="block";
    sendBtn.style.display="none";
  }

  if(state==="shape-trace"){
    instruction.innerText=`Trace the ${currentShape}`;
    stimulus=currentShape;
    drawShape(currentShape);
    nextBtn.style.display="block";
  }

  if(state==="shape-memory"){
    instruction.innerText=`Draw the ${currentShape} from memory`;
    stimulus=currentShape;
    nextBtn.style.display="none";
  }
}

nextBtn.onclick=()=>{
  if(state==="spiral"){
    state="shape-trace";
    currentShape=shapes[Math.floor(Math.random()*shapes.length)];
  } else if(state==="shape-trace"){
    state="shape-memory";
  }
  updateUI();
};

sendBtn.onclick=()=>{
  const name=document.getElementById("username").value || "Anonymous";
  const payload={
    name,
    completed:new Date().toISOString(),
    data
  };
  const body=encodeURIComponent(JSON.stringify(payload,null,2));
  location.href=`mailto:?subject=Neurocognitive Trace Test&body=${body}`;
};

/* ---------------- INIT ---------------- */
updateUI();
</script>
