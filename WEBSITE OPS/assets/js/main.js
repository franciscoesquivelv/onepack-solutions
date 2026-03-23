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
    // No loader (inner pages) — init animations immediately
    initAnimations();
  }

  // ---- NAVBAR SCROLL ----
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  // ---- MOBILE NAV ----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // ---- HERO CANVAS (Particle Network) ----
  initHeroCanvas();

  // ---- SMOOTH SCROLL ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ---- CONTACT FORM (mailto fallback) ----
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#name').value;
      const company = form.querySelector('#company').value;
      const email = form.querySelector('#email').value;
      const service = form.querySelector('#service').value;
      const message = form.querySelector('#message').value;

      const subject = encodeURIComponent(`Contacto Web - ${name} (${company || 'No especificada'})`);
      const body = encodeURIComponent(
        `Nombre: ${name}\nEmpresa: ${company || 'No especificada'}\nCorreo: ${email}\nServicio de interés: ${service || 'No seleccionado'}\n\nMensaje:\n${message}`
      );

      window.location.href = `mailto:info@onepack.com.sv?subject=${subject}&body=${body}`;
    });
  }
});

// ---- REVEAL ON SCROLL (Intersection Observer) ----
function initAnimations() {
  const reveals = document.querySelectorAll('.reveal-up');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay based on siblings
        const siblings = entry.target.parentElement.querySelectorAll('.reveal-up');
        const index = Array.from(siblings).indexOf(entry.target);
        entry.target.style.transitionDelay = `${index * 0.1}s`;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  reveals.forEach(el => observer.observe(el));

  // ---- STAT COUNTERS ----
  initCounters();

  // ---- METRIC COUNTERS ----
  initMetricCounters();

  // ---- PALLET STACK ANIMATION ----
  initPalletAnimation();
}

// ---- STAT COUNTER ANIMATION ----
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));
}

// ---- METRIC COUNTER ANIMATION ----
function initMetricCounters() {
  const metricNumbers = document.querySelectorAll('.metric-number[data-target]');

  const metricObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.dataset.static === 'true') return;

        const target = parseInt(el.dataset.target);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';

        animateMetricCounter(el, target, prefix, suffix);
        metricObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  metricNumbers.forEach(el => metricObserver.observe(el));
}

function animateMetricCounter(el, target, prefix, suffix) {
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = prefix + current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function animateCounter(el, target) {
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ---- PALLET STACK ANIMATION ----
function initPalletAnimation() {
  var track = document.querySelector('.pallet-scroll-track');
  var wrapper = document.querySelector('.pallet-animation-wrapper');
  if (!track || !wrapper || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  var pallets = wrapper.querySelectorAll('.pallet-stack-visual .pallet-visual');
  var steps = wrapper.querySelectorAll('.pallet-step');
  var totalSteps = steps.length;

  if (totalSteps === 0 || pallets.length === 0) return;

  // Set scroll track height to create scroll distance
  var scrollDistance = totalSteps * 600; // 600px per step for comfortable reading
  track.style.height = (wrapper.offsetHeight + scrollDistance) + 'px';

  // Set first step as active
  steps[0].classList.add('active');

  // Use ScrollTrigger on the track — wrapper stays sticky via CSS
  ScrollTrigger.create({
    trigger: track,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.3,
    onUpdate: function(self) {
      var progress = self.progress;
      var currentStep = Math.min(Math.floor(progress * totalSteps), totalSteps - 1);

      // Lift slip sheets from top (last child = top of stack)
      for (var i = pallets.length - 1; i >= 0; i--) {
        var liftIndex = pallets.length - 1 - i;
        if (liftIndex < currentStep) {
          pallets[i].classList.add('lifted');
        } else {
          pallets[i].classList.remove('lifted');
        }
      }

      // Update text steps
      for (var j = 0; j < steps.length; j++) {
        steps[j].classList.toggle('active', j === currentStep);
      }
    }
  });
}

// ---- HERO CANVAS — PARTICLE GRID / NETWORK ----
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: -1000, y: -1000 };
  let animationId;

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    initParticles();
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          const opacity = (1 - dist / 150) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 103, 29, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw & move particles
    particles.forEach(p => {
      // Mouse interaction
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        const force = (200 - dist) / 200;
        p.vx -= (dx / dist) * force * 0.02;
        p.vy -= (dy / dist) * force * 0.02;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Damping
      p.vx *= 0.999;
      p.vy *= 0.999;

      // Bounce
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // Draw
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 103, 29, ${p.opacity})`;
      ctx.fill();
    });

    // Mouse glow
    if (mouse.x > 0) {
      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 200);
      gradient.addColorStop(0, 'rgba(255, 103, 29, 0.06)');
      gradient.addColorStop(1, 'rgba(255, 103, 29, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    animationId = requestAnimationFrame(draw);
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

  window.addEventListener('resize', resize);
  resize();
  draw();
}
