// ── Nav ──────────────────────────────────────────────────────────────────────
const nav    = document.getElementById('nav');
const toggle = document.getElementById('navToggle');
const links  = document.getElementById('navLinks');

window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40), { passive: true });

toggle?.addEventListener('click', () => {
  const open = links?.classList.toggle('open');
  document.body.style.overflow = open ? 'hidden' : '';
});
links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  links.classList.remove('open');
  document.body.style.overflow = '';
}));

// ── Scroll reveal ─────────────────────────────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Counter animation ─────────────────────────────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  if (!target) return;
  const start = performance.now();
  const tick  = (now) => {
    const p = Math.min((now - start) / 1600, 1);
    el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
    if (p < 1) requestAnimationFrame(tick); else el.textContent = target;
  };
  requestAnimationFrame(tick);
}
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.querySelectorAll('[data-target]').forEach(animateCounter); counterObs.unobserve(e.target); } });
}, { threshold: 0.3 });
const aboutVisual = document.querySelector('.about__visual');
if (aboutVisual) counterObs.observe(aboutVisual);

// ── Smooth scroll ─────────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return; e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
