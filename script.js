/* ==========================================================
   SOFIYAN PASHA — PORTFOLIO SCRIPT
   ========================================================== */

'use strict';

// ── 1. LOADING SCREEN ─────────────────────────────────────
const loader = document.getElementById('loader');

window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    // Trigger initial hero reveal
    revealElements();
  }, 1500);
});

// Prevent scroll during load
document.body.style.overflow = 'hidden';

// ── 2. CUSTOM CURSOR ──────────────────────────────────────
const cursor         = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Smooth follower animation
function animateCursor() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top  = followerY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effect on interactive elements
const hoverTargets = document.querySelectorAll(
  'a, button, .filter-btn, .project-card, .cert-card, .skill-card, input, textarea'
);

hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('cursor--hover');
    cursorFollower.classList.add('cursor-follower--hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('cursor--hover');
    cursorFollower.classList.remove('cursor-follower--hover');
  });
});

// ── 3. NAVBAR ─────────────────────────────────────────────
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');

// Scroll class
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveNav();
  handleBackToTop();
  revealElements();
}, { passive: true });

// Hamburger toggle
hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu on nav link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// ── 4. ACTIVE NAV HIGHLIGHTING ────────────────────────────
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  let current = '';
  const scrollY = window.scrollY;

  sections.forEach(section => {
    const top    = section.offsetTop - 100;
    const height = section.offsetHeight;
    if (scrollY >= top && scrollY < top + height) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.dataset.section === current) {
      link.classList.add('active');
    }
  });
}

// ── 5. BACK TO TOP ────────────────────────────────────────
const backToTop = document.getElementById('back-to-top');

function handleBackToTop() {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── 6. DARK / LIGHT THEME TOGGLE ──────────────────────────
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = document.getElementById('theme-icon');
const htmlEl      = document.documentElement;

// Load saved preference
const savedTheme = localStorage.getItem('theme') || 'dark';
htmlEl.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark'
    ? 'fa-solid fa-sun'
    : 'fa-solid fa-moon';
}

// ── 7. TYPING ANIMATION ───────────────────────────────────
const phrases = [
  'software.',
  'web apps.',
  'clean code.',
  'solutions.',
];

let phraseIndex  = 0;
let charIndex    = 0;
let isDeleting   = false;
const typedEl    = document.getElementById('typed-text');

function typeLoop() {
  const phrase     = phrases[phraseIndex];
  const speed      = isDeleting ? 60 : 110;
  const pauseDelay = isDeleting ? 0 : 1800;

  if (!isDeleting && charIndex < phrase.length) {
    typedEl.textContent = phrase.slice(0, ++charIndex);
    setTimeout(typeLoop, speed);
  } else if (isDeleting && charIndex > 0) {
    typedEl.textContent = phrase.slice(0, --charIndex);
    setTimeout(typeLoop, speed);
  } else if (!isDeleting) {
    isDeleting = true;
    setTimeout(typeLoop, pauseDelay);
  } else {
    isDeleting   = false;
    charIndex    = 0;
    phraseIndex  = (phraseIndex + 1) % phrases.length;
    setTimeout(typeLoop, 300);
  }
}

// Start after loader hides
setTimeout(typeLoop, 1700);

// ── 8. SCROLL REVEAL ──────────────────────────────────────
function revealElements() {
  const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  reveals.forEach(el => {
    const rect    = el.getBoundingClientRect();
    const inView  = rect.top < window.innerHeight - 80;
    if (inView) el.classList.add('visible');
  });
}

// Also observe for skill bars
const skillBarObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.skill-bar__fill');
      fills.forEach(fill => {
        const width = fill.dataset.width;
        setTimeout(() => { fill.style.width = width + '%'; }, 200);
      });
      skillBarObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-card').forEach(card => {
  skillBarObserver.observe(card);
});

// ── 9. ANIMATED COUNTERS ──────────────────────────────────
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => {
  counterObserver.observe(el);
});

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1400;
  const start    = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

// ── 10. PROJECT FILTERS ───────────────────────────────────
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const cats = card.dataset.category || '';
      const show = filter === 'all' || cats.split(' ').includes(filter);

      if (show) {
        card.classList.remove('hidden');
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = '';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ── 11. CONTACT FORM VALIDATION ───────────────────────────
const contactForm = document.getElementById('contact-form');
const formStatus  = document.getElementById('form-status');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameEl    = document.getElementById('name');
  const emailEl   = document.getElementById('email');
  const msgEl     = document.getElementById('message');

  // Clear previous errors
  clearErrors();

  let valid = true;

  // Validate name
  if (nameEl.value.trim().length < 2) {
    showError('name', 'Please enter your full name.');
    nameEl.classList.add('error');
    valid = false;
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailEl.value.trim())) {
    showError('email', 'Please enter a valid email address.');
    emailEl.classList.add('error');
    valid = false;
  }

  // Validate message
  if (msgEl.value.trim().length < 10) {
    showError('message', 'Message must be at least 10 characters.');
    msgEl.classList.add('error');
    valid = false;
  }

  if (!valid) return;

  // Simulate form submission
  const submitBtn  = contactForm.querySelector('button[type="submit"]');
  const btnText    = submitBtn.querySelector('.btn-text');
  const originalTx = btnText.textContent;

  submitBtn.disabled  = true;
  btnText.textContent = 'Sending…';

  setTimeout(() => {
    formStatus.className = 'form-status success';
    formStatus.textContent = '✓ Message sent! I\'ll get back to you soon.';
    contactForm.reset();
    submitBtn.disabled  = false;
    btnText.textContent = originalTx;

    setTimeout(() => {
      formStatus.className = 'form-status';
      formStatus.textContent = '';
    }, 5000);
  }, 1400);
});

function showError(fieldId, message) {
  const errorEl = document.getElementById(fieldId + '-error');
  if (errorEl) errorEl.textContent = message;
}

function clearErrors() {
  ['name', 'email', 'message'].forEach(id => {
    const el = document.getElementById(id);
    const er = document.getElementById(id + '-error');
    if (el) el.classList.remove('error');
    if (er) er.textContent = '';
  });
  formStatus.className = 'form-status';
  formStatus.textContent = '';
}

// ── 12. SMOOTH ANCHOR SCROLLING ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

// ── 13. RESUME BUTTON (placeholder) ───────────────────────
document.getElementById('resume-btn').addEventListener('click', (e) => {
  e.preventDefault();
  // In production: point href to actual PDF
  alert('Resume PDF coming soon! For now, please reach out via the contact form.');
});

// ── 14. INIT ──────────────────────────────────────────────
// Run reveal on initial paint (after loader)
document.addEventListener('DOMContentLoaded', () => {
  updateActiveNav();
});
