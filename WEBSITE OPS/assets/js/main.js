/* ========================================
   ONEPACK SOLUTIONS — MAIN JS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- LOADER ----
  const loader = document.getElementById('loader');
  const loaderFill = document.querySelector('.loader-bar-fill');

  if (loader && loaderFill) {
    let progress = 0;
    document.body.style.overflow = 'hidden';

    const loaderInterval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(loaderInterval);
        loaderFill.style.width = '100%';
        setTimeout(() => {
          loader.classList.add('hidden');
          document.body.style.overflow = '';
          initAnimations();
        }, 400);
      }
      loaderFill.style.width = progress + '%';
    }, 120);
  } else {
    initAnimations();
  }

  // ---- NAVBAR SCROLL ----
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // ---- MOBILE NAV + BACKDROP ----
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  const backdrop  = document.getElementById('navBackdrop');

  function openNav() {
    navToggle.classList.add('active');
    navLinks.classList.add('open');
    backdrop.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
    backdrop.classList.remove('visible');
    document.body.style.overflow = '';
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.contains('open') ? closeNav() : openNav();
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeNav);
  }

  // ---- HERO CANVAS ----
  initHeroCanvas();

  // ---- SMOOTH SCROLL ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const y = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ---- CONTACT FORM ----
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn  = document.getElementById('submitBtn');
      const msgEl      = document.getElementById('formMessage');
      const formData   = new FormData(form);

      submitBtn.disabled    = true;
      submitBtn.textContent = 'Enviando...';
      msgEl.style.display   = 'none';

      try {
        const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
        const data = await res.json();

        if (data.success) {
          msgEl.style.background  = 'rgba(34,197,94,0.12)';
          msgEl.style.color       = '#16a34a';
          msgEl.style.border      = '1px solid rgba(34,197,94,0.3)';
          msgEl.textContent       = 'Mensaje enviado. Te contactamos pronto.';
          msgEl.style.opacity     = '0';
          msgEl.style.transform   = 'translateY(8px)';
          msgEl.style.transition  = 'opacity 0.4s ease, transform 0.4s ease';
          msgEl.style.display     = 'block';
          msgEl.offsetHeight;
          msgEl.style.opacity     = '1';
          msgEl.style.transform   = 'translateY(0)';
          form.reset();
        } else {
          throw new Error(data.message || 'Error al enviar');
        }
      } catch {
        msgEl.style.background = 'rgba(239,68,68,0.1)';
        msgEl.style.color      = '#dc2626';
        msgEl.style.border     = '1px solid rgba(239,68,68,0.3)';
        msgEl.textContent      = 'No se pudo enviar. Escríbenos directamente a info@onepack.com.sv';
        msgEl.style.display    = 'block';
      } finally {
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Enviar mensaje';
      }
    });
  }

  // ---- SOLUTIONS TABS ----
  initSolutionsTabs();

});

// ========================================
// INIT ANIMATIONS (called after loader)
// ========================================
function initAnimations() {
  initRevealOnScroll();
  initMetricCounters();
  initProductCardTilt();
}

// ---- REVEAL ON SCROLL ----
function initRevealOnScroll() {
  const reveals = document.querySelectorAll('.reveal-up');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = entry.target.parentElement.querySelectorAll('.reveal-up');
        const index    = Array.from(siblings).indexOf(entry.target);
        entry.target.style.transitionDelay = `${Math.min(index * 0.08, 0.4)}s`;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));
}

// ---- METRIC COUNTER ANIMATION ----
function initMetricCounters() {
  const metricNumbers = document.querySelectorAll('.metric-number[data-target]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        animateCounter(el, target, prefix, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  metricNumbers.forEach(el => observer.observe(el));
}

function animateCounter(el, target, prefix, suffix) {
  const duration  = 2000;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(eased * target);
    el.textContent = prefix + current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ---- PRODUCT CARD TILT (desktop only) ----
function initProductCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return;

  const cards = document.querySelectorAll('.product-card, .why-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -4;
      const rotateY = ((x - cx) / cx) *  4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ---- SOLUTIONS TABS ----
function initSolutionsTabs() {
  const tabBtns   = document.querySelectorAll('.solutions-tab-btn');
  const tabPanels = document.querySelectorAll('.solutions-tab-panel');

  if (!tabBtns.length || !tabPanels.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      // Update buttons
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Update panels
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
      });
      const activePanel = document.getElementById(`tab-${target}`);
      if (activePanel) activePanel.classList.add('active');

      // On mobile: scroll tab into view
      if (window.innerWidth <= 768) {
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });
  });
}

// ---- HERO CANVAS — PARTICLE NETWORK ----
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: -1000, y: -1000 };

  function resize() {
    canvas.width  = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    initParticles();
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 13000), 100);
    for (let i = 0; i < count; i++) {
      particles.push({
        x:       Math.random() * canvas.width,
        y:       Math.random() * canvas.height,
        vx:      (Math.random() - 0.5) * 0.35,
        vy:      (Math.random() - 0.5) * 0.35,
        radius:  Math.random() * 1.8 + 0.8,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          const alpha = (1 - dist / 140) * 0.12;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255,103,29,${alpha})`;
          ctx.lineWidth   = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      const dx   = mouse.x - p.x;
      const dy   = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 180) {
        const force = (180 - dist) / 180;
        p.vx -= (dx / dist) * force * 0.018;
        p.vy -= (dy / dist) * force * 0.018;
      }

      p.x  += p.vx;
      p.y  += p.vy;
      p.vx *= 0.999;
      p.vy *= 0.999;

      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,103,29,${p.opacity})`;
      ctx.fill();
    });

    if (mouse.x > 0) {
      const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 180);
      g.addColorStop(0, 'rgba(255,103,29,0.05)');
      g.addColorStop(1, 'rgba(255,103,29,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    requestAnimationFrame(draw);
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  }, { passive: true });

  resize();
  draw();
}
