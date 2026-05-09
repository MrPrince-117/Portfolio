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