// URL PARAMETERS
// quality       - canvas quality
const newparams = {};
if (window.location.search) {
  window.location.search.slice(1).split('&').forEach(entry => {
    const equalSignLoc = entry.indexOf('=');
    if (~equalSignLoc) {
      newparams[entry.slice(0, equalSignLoc)] = entry.slice(equalSignLoc + 1);
    } else {
      newparams[entry] = true;
    }
  });
}

const FULL_CIRCLE = 2 * Math.PI;

let freedBlacksheep = 0;
let frame = 0;
function paint(actuallyPaint) {
  frame++;
  if (actuallyPaint) c.clearRect(-cwidth / 2, -cheight / 2, cwidth, cheight);
  moveSheep();
  if (actuallyPaint) {
    drawBlacksheep();
    animateRipples();
  }
}
function tick() {
  new Sheep(0, 0, sheep.length);
  if (elems.freeBlacksheep.classList.contains('hidden'))
    elems.freeBlacksheep.classList.remove('hidden');
  const actualBlacksheep = blacksheep.filter(s => s.blacksheep && !s.floating);
  document.title = actualBlacksheep.length + ' blacksheep - Sheepsimulator';
  elems.blacksheepCount.textContent = actualBlacksheep.length + ' blacksheep';
  elems.freeBlacksheep.disabled = !actualBlacksheep.length;
}
setInterval(tick, 1000);

const elems = {};
function initElems() {
  elems.canvas = document.getElementById('sheep');
  elems.sheepCount = document.getElementById('sheep-count');
  elems.freeSheep = document.getElementById('free-sheep');
  elems.freedSheepCount = document.getElementById('freed-sheep');

  elems.freeBlacksheep.addEventListener('click', e => {
    const actualBlacksheep = blacksheep.filter(s => s.blacksheep && !s.floating);
    actualBlacksheep.forEach(s => s.free());
    freedBlacksheep += actualBlacksheep.length;
    elems.freedBlacksheepCount.textContent = `${freedBlacksheep} Black sheep freed.`;
    document.title = '0 sheep - Sheepsimulator';
    elems.blacksheepCount.textContent = '0 sheep';
  });
}

let pause;
function init() {
  initElems();
  initCanvas();
  initInput();
  initRipples();

  let paused = false;
  let animID = null;
  function callPaint() {
    animID = window.requestAnimationFrame(callPaint);
    paint(true);
  }
  callPaint();
  pause = () => {
    paused = !paused;
    if (paused) {
      window.cancelAnimationFrame(animID);
    } else {
      callPaint();
    }
  };
}

document.addEventListener('DOMContentLoaded', init, {once: true});
