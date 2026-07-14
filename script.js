/* ═══════════════════════════════════════════════
   AI TECH UNIVERSITY — script.js
   Vanilla JS only, no dependencies
═══════════════════════════════════════════════ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  injectLoadingScreen();
  injectProgressBar();
  injectBackToTop();
  upgradeNavbar();
  wrapTables();
  initHamburger();
  initSmoothScroll();
  initScrollReveal();
  initFormValidation();
  setActiveNavLink();
});

window.addEventListener('load', () => {
  const loader = document.getElementById('loading-screen');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 700);
  }
});
document.body.style.overflow = 'hidden';

window.addEventListener('scroll', () => {
  updateProgressBar();
  handleNavScroll();
  handleBackToTop();
}, { passive: true });

/* ── Loading screen ── */
function injectLoadingScreen() {
  const loader = document.createElement('div');
  loader.id = 'loading-screen';
  loader.innerHTML = `
    <div class="loader">
      <div class="loader-logo">AI Tech <span>University</span></div>
      <div class="loader-spinner"></div>
    </div>`;
  document.body.prepend(loader);
}

/* ── Scroll progress bar ── */
function injectProgressBar() {
  const bar = document.createElement('div');
  bar.id = 'progress-bar';
  document.body.prepend(bar);
}
function updateProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width = (docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0) + '%';
}

/* ── Sticky nav shadow on scroll ── */
function handleNavScroll() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 40);
}

/* ── Back to top button ── */
function injectBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.innerHTML = '&uarr;';
  btn.setAttribute('aria-label', 'Back to top');
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(btn);
}
function handleBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  btn.classList.toggle('visible', window.scrollY > 400);
}

/* ── Wraps the .nav-links <ul> with a logo + hamburger, once per page ── */
function upgradeNavbar() {
  const nav = document.querySelector('.navbar');
  const ul = document.querySelector('.nav-links');
  if (!nav || !ul || nav.querySelector('.nav-inner')) return;

  const inner = document.createElement('div');
  inner.className = 'nav-inner';

  const logo = document.createElement('a');
  logo.href = 'index.html';
  logo.className = 'nav-logo';
  logo.innerHTML = `
    <span class="nav-logo-icon">AT</span>
    <span class="nav-logo-text">
      <span class="nav-logo-name">AI Tech University</span>
      <span class="nav-logo-sub">Excellence in Technology</span>
    </span>`;

  const hamburger = document.createElement('button');
  hamburger.className = 'hamburger';
  hamburger.id = 'hamburger';
  hamburger.setAttribute('aria-label', 'Toggle menu');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span></span><span></span><span></span>';

  // mark the admission link as the CTA pill
  ul.querySelectorAll('li').forEach(li => {
    const a = li.querySelector('a');
    if (a && a.getAttribute('href') === 'admission.html') li.classList.add('nav-apply');
  });

  nav.insertBefore(inner, ul);
  inner.appendChild(logo);
  inner.appendChild(ul);
  inner.appendChild(hamburger);
}

/* ── Hamburger toggle ── */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('active');
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ── Smooth scroll for in-page anchors ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = document.querySelector('.navbar')?.offsetHeight || 70;
        window.scrollTo({ top: target.offsetTop - navHeight - 16, behavior: 'smooth' });
      }
    });
  });
}

/* ── Highlight current page in nav ── */
function setActiveNavLink() {
  const current = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = (link.getAttribute('href') || '').toLowerCase();
    link.classList.toggle('active', href === current || (current === '' && href === 'index.html'));
  });
}

/* ── Scroll-reveal animation ── */
function initScrollReveal() {
  const els = document.querySelectorAll(
    'main > p, main h2, main h3, main h4, .img-card, .data-table, .site-form, ' +
    '.program-card, .facility-card, .scholarship-box, .contact-info-card, .about-section'
  );
  els.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 6) * 0.05}s`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ── Wrap every table for horizontal scroll on mobile ── */
function wrapTables() {
  document.querySelectorAll('.data-table').forEach(table => {
    if (table.parentElement.classList.contains('table-wrap')) return;
    const wrap = document.createElement('div');
    wrap.className = 'table-wrap';
    table.parentNode.insertBefore(wrap, table);
    wrap.appendChild(table);
  });
}

/* ── Form validation ── */
function initFormValidation() {
  document.querySelectorAll('.site-form').forEach(form => {
    const inputs = form.querySelectorAll('input[required], textarea[required]');

    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => clearError(input));
    });

    form.addEventListener('submit', e => {
      let valid = true;
      inputs.forEach(input => { if (!validateField(input)) valid = false; });

      if (!valid) {
        e.preventDefault();
        form.querySelector('.field-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        const original = btn.textContent;
        btn.textContent = 'Submitting...';
        btn.disabled = true;
        setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 3000);
      }
    });
  });
}

function validateField(input) {
  clearError(input);
  let message = '';

  if (input.required && !input.value.trim()) {
    message = 'This field is required';
  } else if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
    message = 'Please enter a valid email address';
  } else if (input.type === 'tel' && input.value && !/^[+]?[\d\s\-()]{7,}$/.test(input.value)) {
    message = 'Please enter a valid phone number';
  }

  if (message) {
    showError(input, message);
    return false;
  }
  return true;
}

function showError(input, message) {
  input.style.borderColor = '#dc2626';
  input.style.boxShadow = '0 0 0 3px rgba(220,38,38,0.12)';
  const error = document.createElement('span');
  error.className = 'field-error';
  error.textContent = message;
  (input.closest('p') || input.parentElement).appendChild(error);
}

function clearError(input) {
  input.style.borderColor = '';
  input.style.boxShadow = '';
  const parent = input.closest('p') || input.parentElement;
  parent.querySelector('.field-error')?.remove();
}