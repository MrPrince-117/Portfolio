// Animación de entrada al hacer scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card, .stack-item, .hero-stat').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// Cursor en el nav-logo
const logo = document.querySelector('.nav-logo');
let i = 0;
const chars = ['BTM_', 'BTM|', 'BTM_'];
setInterval(() => {
  logo.textContent = chars[i % chars.length];
  i++;
}, 600);