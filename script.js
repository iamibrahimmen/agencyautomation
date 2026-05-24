/* ============================================================
   AGENCY AUTOMATION — MAIN JS
   agencyautomation.site
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Page Loader ──
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 1400);
  }

  // ── Custom Cursor ──
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (cursor) { cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; }
  });

  function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    if (cursorRing) { cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px'; }
    requestAnimationFrame(animRing);
  }
  animRing();

  // ── Navbar Scroll ──
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // ── Mobile Menu ──
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');

  if (hamburger) hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
  if (mobileClose) mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  // ── Smooth Scroll ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Scroll Reveal ──
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => revealObserver.observe(el));

  // ── Counter Animation ──
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = (eased * target).toFixed(decimals);
      el.textContent = prefix + current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = '1';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

  // ── Industry Tabs ──
  const indTabs   = document.querySelectorAll('.ind-tab');
  const indPanels = document.querySelectorAll('.industry-panel');

  function activateTab(targetId) {
    indTabs.forEach(t => t.classList.toggle('active', t.dataset.target === targetId));
    indPanels.forEach(p => {
      const isActive = p.id === 'panel-' + targetId;
      p.classList.toggle('active', isActive);
      if (isActive) {
        p.style.opacity = '0';
        p.style.transform = 'translateY(10px)';
        requestAnimationFrame(() => {
          p.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          p.style.opacity = '1';
          p.style.transform = 'translateY(0)';
        });
      }
    });
  }

  indTabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab.dataset.target));
  });

  // ── FAQ ──
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // ── Step Line Draw ──
  const stepLine = document.querySelector('.step-line-draw');
  if (stepLine) {
    const lineObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { stepLine.classList.add('drawn'); lineObserver.disconnect(); }
    }, { threshold: 0.5 });
    lineObserver.observe(stepLine);
  }

  // ── Hero Canvas — Particle Grid ──
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], lines = [];

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', () => { resize(); initParticles(); }, { passive: true });

    const PARTICLE_COUNT = Math.min(80, Math.floor(window.innerWidth / 15));

    function initParticles() {
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r:  Math.random() * 1.5 + 0.5,
        a:  Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.5 ? '#7B2FFF' : '#00F5FF',
      }));
    }
    initParticles();

    let animFrame;
    function drawFrame() {
      ctx.clearRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = 'rgba(123,47,255,0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 60) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Particles & connections
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(')', ',' + p.a + ')').replace('rgb', 'rgba').replace('#7B2FFF', 'rgba(123,47,255,' + p.a + ')').replace('#00F5FF', 'rgba(0,245,255,' + p.a + ')');
        ctx.fill();
      });

      // Connect nearby
      const DIST = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < DIST) {
            const alpha = (1 - dist / DIST) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(123,47,255,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animFrame = requestAnimationFrame(drawFrame);
    }
    drawFrame();
  }

  // ── Typewriter Effect for Hero ──
  const typeEl = document.getElementById('hero-typewriter');
  if (typeEl) {
    const phrases = [
      'AI Lead Generation',
      'WhatsApp Automation',
      'CRM Integration',
      'Sales Chatbots',
      'Workflow Automation',
    ];
    let pi = 0, ci = 0, deleting = false;

    function type() {
      const phrase = phrases[pi];
      typeEl.textContent = phrase.slice(0, ci);
      if (!deleting) {
        ci++;
        if (ci > phrase.length) { deleting = true; setTimeout(type, 1800); return; }
        setTimeout(type, 70);
      } else {
        ci--;
        if (ci < 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(type, 400); return; }
        setTimeout(type, 35);
      }
    }
    setTimeout(type, 1600);
  }

});
