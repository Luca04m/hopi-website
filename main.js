/* ========================================
   HOPI AGENCY — Main JavaScript (Premium Animations)
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── INIT LENIS (SMOOTH SCROLL) ──
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-like ease
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Sync GSAP with Lenis (single tick source — avoid double-tick bug)
  gsap.registerPlugin(ScrollTrigger);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0, 0);

  // ── LOADER (Premium Ring + Counter) ──
  const loader = document.getElementById('loader');
  const ringFill = loader.querySelector('.loader-ring-fill');
  const counterEl = loader.querySelector('.loader-counter');
  const circumference = 2 * Math.PI * 42; // r=42

  document.body.style.overflow = 'hidden';

  // Animate ring stroke and counter
  const loaderTl = gsap.timeline({
    onComplete: () => {
      gsap.to(loader, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          loader.style.display = 'none';
          document.body.style.overflow = '';
          initGSAPReveal();
          animateCounters();
        }
      });
    }
  });

  loaderTl.to({ val: 0 }, {
    val: 100,
    duration: 1.6,
    ease: 'power2.inOut',
    onUpdate: function () {
      const v = Math.round(this.targets()[0].val);
      counterEl.textContent = v;
      const offset = circumference - (circumference * v / 100);
      ringFill.style.strokeDashoffset = offset;
    }
  });

  // Pulse the logo during load
  gsap.to('.loader-logo-img', {
    opacity: 1,
    scale: 1.05,
    duration: 0.8,
    yoyo: true,
    repeat: 1,
    ease: 'power1.inOut',
  });

  // ── CUSTOM CURSOR & MAGNETIC EFFECT ──
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  if (window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function animateCursor() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover states
    const hoverElements = document.querySelectorAll('a, button, .project-card, .service-card, .testimonial-card');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => follower.classList.add('hover'));
      el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
    });

    // Magnetic Buttons (Premium feel)
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-outline, .about-cta-card');
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const h = rect.width / 2;
        const v = rect.height / 2;
        const x = e.clientX - rect.left - h;
        const y = e.clientY - rect.top - v;

        gsap.to(btn, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.4,
          ease: 'power2.out',
        });
        follower.classList.add('hover');
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.3)',
        });
        follower.classList.remove('hover');
      });
    });
  }

  // ── MOBILE MENU ──
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ── SMOOTH SCROLL FOR IN-PAGE LINKS (LENIS) ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length > 1) { // Prevents hijacking pure '#' links
        e.preventDefault();
        lenis.scrollTo(targetId, {
          offset: -20,
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }
    });
  });

  // ── ADVANCED GSAP REVEALS ──
  function initGSAPReveal() {
    // Make hero elements visible and set initial state for animation
    gsap.set('.reveal-hero', { visibility: 'visible' });
    gsap.set('.reveal-hero-delayed', { visibility: 'visible' });
    gsap.set('.hero-badge, .hero-title, .hero-sub, .hero-btns', { opacity: 0, y: 40 });
    gsap.set('.hero-stats-row .hstat', { opacity: 0, y: 20 });

    // 1. Hero — badge, title, subtitle, buttons (staggered entrance)
    const heroTl = gsap.timeline({ delay: 0.1 });
    heroTl
      .to('.hero-badge', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
      .to('.hero-title', { opacity: 1, y: 0, duration: 1, ease: 'power4.out' }, '-=0.5')
      .to('.hero-sub', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.6')
      .to('.hero-btns', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5');

    // Hero stats — fade up with stagger
    gsap.to('.hero-stats-row .hstat', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      delay: 1.2
    });

    // 2. Section Headers — slide up with split animation
    const sectionHeaders = document.querySelectorAll('.section-header-katanex');
    sectionHeaders.forEach(header => {
      gsap.from(header.children, {
        immediateRender: false,
        scrollTrigger: {
          trigger: header,
          start: 'top 88%',
          once: true,
        },
        y: 50,
        opacity: 0,
        duration: 1.1,
        stagger: 0.2,
        ease: 'power3.out'
      });
    });

    // 3. Grids — staggered cards with scale
    const grids = document.querySelectorAll('.projects-grid, .services-grid, .testimonials-grid');
    grids.forEach(grid => {
      const children = Array.from(grid.children);
      gsap.from(children, {
        immediateRender: false,
        scrollTrigger: {
          trigger: grid,
          start: 'top 88%',
          once: true,
        },
        y: 60,
        opacity: 0,
        scale: 0.96,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power4.out'
      });
    });

    // 5. Process steps — staggered scale entrance
    const processSteps = document.querySelectorAll('.process-step');
    gsap.from(processSteps, {
      immediateRender: false,
      scrollTrigger: {
        trigger: '.process-grid',
        start: 'top 85%',
        once: true,
      },
      y: 40,
      opacity: 0,
      scale: 0.92,
      duration: 0.9,
      stagger: 0.12,
      ease: 'back.out(1.2)'
    });

    // 6. Parallax Image Effect in Projects
    const projectCards = document.querySelectorAll('.project-image-placeholder');
    projectCards.forEach(img => {
      gsap.to(img, {
        backgroundPosition: `50% 100%`,
        ease: 'none',
        scrollTrigger: {
          trigger: img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });

    // 7. Footer CTA — scale entrance
    gsap.from('.uf-top', {
      immediateRender: false,
      scrollTrigger: {
        trigger: '.uf-top',
        start: 'top 88%',
        once: true,
      },
      scale: 0.95,
      opacity: 0,
      y: 50,
      duration: 1.2,
      ease: 'expo.out'
    });

    // 8. Footer links and brand — staggered
    gsap.from('.uf-middle, .uf-bottom', {
      immediateRender: false,
      scrollTrigger: {
        trigger: '.uf-middle',
        start: 'top 92%',
        once: true,
      },
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out'
    });

    // 9. Hero scroll-away transition (parallax fade + scale)
    const heroWrap = document.querySelector('.hero-wrap');
    if (heroWrap) {
      gsap.to(heroWrap, {
        opacity: 0,
        y: -80,
        scale: 0.95,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: '70% top',
          scrub: true,
        }
      });
    }

    // Header parallax fade out
    const header = document.getElementById('header');
    if (header) {
      gsap.to(header, {
        opacity: 0,
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: '10% top',
          end: '40% top',
          scrub: true,
        }
      });
    }

    // Recalcula posições após layout final
    ScrollTrigger.refresh();
  }

  // ── COUNTER ANIMATION ──
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          const duration = 2000;
          const step = target / (duration / 16);
          let current = 0;

          function update() {
            current += step;
            if (current >= target) {
              el.textContent = target;
            } else {
              el.textContent = Math.floor(current);
              requestAnimationFrame(update);
            }
          }
          update();
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  // ── FAQ ACCORDION ──
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item.active').forEach(active => {
        active.classList.remove('active');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        // Simple GSAP bounce
        gsap.fromTo(item.querySelector('.faq-answer'),
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' }
        );
      }
    });
  });


});
