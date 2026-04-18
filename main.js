// ── CURSOR PERSONALIZADO ─────────────────────────────────
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  rx += (e.clientX - rx) * 0.12;
  ry += (e.clientY - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
});

function animateRing() {
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// ── PARTÍCULAS ───────────────────────────────────────────
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let mouse = { x: null, y: null };
let particles = [];
const NUM = 90;
const ACCENT = '192, 169, 245';

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); init(); });
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    if (mouse.x !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        this.x -= dx * force * 0.03;
        this.y -= dy * force * 0.03;
      }
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${ACCENT}, ${this.opacity})`;
    ctx.fill();
  }
}

function init() {
  particles = [];
  for (let i = 0; i < NUM; i++) particles.push(new Particle());
}

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        const opacity = (1 - dist / 130) * 0.15;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(${ACCENT}, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
    if (mouse.x !== null) {
      const dx = particles[i].x - mouse.x;
      const dy = particles[i].y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 160) {
        const opacity = (1 - dist / 160) * 0.4;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(${ACCENT}, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animate);
}

init();
animate();

// ── TEXTO ESCRIBIÉNDOSE ──────────────────────────────────
const lines = ['Borja', 'Ticona Manrique'];
const typed = document.getElementById('typed');
let lineIndex = 0;
let charIndex = 0;
let isDeleting = false;
let currentText = '';

function typeEffect() {
  const fullText = lines[lineIndex];

  if (!isDeleting) {
    currentText = fullText.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === fullText.length) {
      if (lineIndex === 0) {
        setTimeout(() => {
          currentText += '\n';
          typed.innerHTML = currentText.replace('\n', '<br>');
          lineIndex = 1;
          charIndex = 0;
          setTimeout(typeEffect, 300);
        }, 400);
        return;
      }
      isDeleting = false;
      setTimeout(typeEffect, 2000);
      return;
    }
  }

  typed.innerHTML = lineIndex === 0
    ? currentText
    : lines[0] + '<br>' + currentText;

  setTimeout(typeEffect, isDeleting ? 60 : 100);
}

setTimeout(typeEffect, 800);

// ── SONIDO AL HOVER ──────────────────────────────────────
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playHover() {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.08);
  gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.08);
}

document.querySelectorAll('a, .stack-item, .project-card, .contact-btn').forEach(el => {
  el.addEventListener('mouseenter', playHover);
});

// ── TERMINAL ─────────────────────────────────────────────
const input = document.getElementById('terminal-input');
const output = document.getElementById('terminal-output');

const commands = {
  help: () => `
    <span class="t-accent">Comandos disponibles:</span><br>
    &nbsp;<span class="t-accent">about</span> &nbsp;&nbsp;&nbsp;— quién soy<br>
    &nbsp;<span class="t-accent">stack</span> &nbsp;&nbsp;&nbsp;— tecnologías que uso<br>
    &nbsp;<span class="t-accent">proyectos</span> — mis proyectos<br>
    &nbsp;<span class="t-accent">contacto</span> &nbsp;— cómo contactarme<br>
    &nbsp;<span class="t-accent">clear</span> &nbsp;&nbsp;&nbsp;— limpiar terminal
  `,
  about: () => `
    <span class="t-success">Borja Ticona Manrique</span> — Backend Developer.<br>
    Actualmente en prácticas desarrollando una plataforma<br>
    automatizada para ENS Alto. TFG en curso: planificador<br>
    de viajes inteligente.
  `,
  stack: () => `
    <span class="t-success">Lenguajes:</span> Java, Python, C, Kotlin<br>
    <span class="t-success">Mobile:</span> Android Studio<br>
    <span class="t-success">Datos:</span> SQL, bases de datos relacionales<br>
    <span class="t-success">Otros:</span> HTML
  `,
  proyectos: () => `
    <span class="t-success">01</span> — Plataforma automatizada ENS Alto<br>
    &nbsp;&nbsp;&nbsp;&nbsp; Backend · Automatización · En desarrollo<br><br>
    <span class="t-success">02</span> — Planificador de viajes inteligente<br>
    &nbsp;&nbsp;&nbsp;&nbsp; IA · Lógica · TFG en curso
  `,
  contacto: () => `
    <span class="t-success">Email:</span> <span class="t-accent">tucorreo@email.com</span><br>
    <span class="t-success">GitHub:</span> <span class="t-accent">github.com/tu-usuario</span>
  `,
  clear: () => {
    output.innerHTML = '';
    return null;
  }
};

function addLine(prompt, text, isOutput = false) {
  const line = document.createElement('div');
  line.className = 't-line';
  if (isOutput) {
    line.innerHTML = `<span class="t-text">${text}</span>`;
  } else {
    line.innerHTML = `<span class="t-prompt">~ $</span><span class="t-text">${text}</span>`;
  }
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

input.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const val = input.value.trim().toLowerCase();
  if (!val) return;

  addLine('~ $', val);

  if (commands[val]) {
    const result = commands[val]();
    if (result !== null) addLine('', result, true);
  } else {
    addLine('', `<span class="t-error">comando no encontrado: ${val}. Escribe <span class="t-accent">help</span>.</span>`, true);
  }

  input.value = '';
});

// ── NAV LOGO BLINK ───────────────────────────────────────
const logo = document.querySelector('.nav-logo');
let i = 0;
const chars = ['BTM_', 'BTM|'];
setInterval(() => { logo.textContent = chars[i++ % 2]; }, 600);

// ── SCROLL REVEAL ────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card, .stack-item, .hero-stat').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});