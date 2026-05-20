/* ============================================================
   1utama.js — PT. Hyarta Danadipa Raya
   Satu file JS untuk semua halaman.
   Tiap fitur dicek dulu apakah elemennya ada, 
   supaya tidak error di halaman lain.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. CUSTOM CURSOR ───────────────────────────────────────
  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX - 6 + 'px';
    cursor.style.top  = e.clientY - 6 + 'px';
  });

  document.querySelectorAll('a, button, .kartu').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
  });


  // ─── 2. NAVBAR : scroll effect + hamburger ──────────────────
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('mobileDrawer');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  if (hamburger && drawer) {
    hamburger.addEventListener('click', e => {
      e.stopPropagation();
      hamburger.classList.toggle('open');
      drawer.classList.toggle('open');
    });
    // Tutup drawer kalau klik di luar
    document.addEventListener('click', e => {
      if (!drawer.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('open');
        drawer.classList.remove('open');
      }
    });
  }


  // ─── 3. SCROLL REVEAL ───────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // animasi sekali saja
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));


  // ─── 4. ANIMATED COUNTER (stat bar) ─────────────────────────
  const statNums = document.querySelectorAll('.stat-num[data-target]');

  if (statNums.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1600; // ms
        const start    = performance.now();

        function tick(now) {
          const elapsed  = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    statNums.forEach(el => countObserver.observe(el));
  }


  // ─── 5. SCROLL TO TOP BUTTON ────────────────────────────────
  const scrollTopBtn = document.getElementById('scrollTop');

  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // ─── 6. ACTIVE NAV LINK berdasarkan URL ─────────────────────
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href')?.split('/').pop() || '';
    if (linkPage === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });


  // ─── 7. PARALLAX ringan pada hero ───────────────────────────
  const hero = document.querySelector('.halaman1');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        // Geser background sedikit ke bawah saat scroll
        hero.style.backgroundPositionY = `calc(center + ${scrollY * 0.3}px)`;
      }
    }, { passive: true });
  }


  // ─── 8. SMOOTH SCROLL untuk anchor link ─────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ─── 9. KARTU hover sound/ripple effect ─────────────────────
  document.querySelectorAll('.halaman4 .kartu, .halaman5 .kartu, .halaman6 .kartu').forEach(kartu => {
    kartu.addEventListener('click', function(e) {
      // Skip jika kartu adalah link <a>
      if (this.tagName === 'A') return;
      
      const ripple = document.createElement('span');
      const rect   = this.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute;
        width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top - size/2}px;
        background:rgba(232,160,32,0.15);
        border-radius:50%;
        transform:scale(0);
        animation:rippleAnim 0.6s ease-out;
        pointer-events:none;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Inject keyframe for ripple
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleAnim {
      to { transform: scale(2.5); opacity: 0; }
    }
  `;
  document.head.appendChild(style);


  // ─── 10. PAGE TRANSITION (masuk halaman) ────────────────────
  document.body.style.transition = 'opacity 0.4s ease';
  document.body.style.opacity = '0';

  // Pastikan body selalu kembali visible & bisa diklik
  function showBody() {
    document.body.style.opacity = '1';
    document.body.style.pointerEvents = '';
  }

  // Fallback berlapis agar tidak nyangkut di HP
  window.addEventListener('load', showBody);
  setTimeout(showBody, 600);
  requestAnimationFrame(() => { requestAnimationFrame(showBody); });

  // Transisi keluar saat klik link antar halaman
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    // Hanya untuk link lokal (bukan anchor, bukan tab baru, bukan eksternal)
    if (
      href &&
      !href.startsWith('#') &&
      !href.startsWith('http') &&
      !link.getAttribute('target')
    ) {
      link.addEventListener('click', e => {
        e.preventDefault();
        document.body.style.opacity = '0';
        document.body.style.pointerEvents = 'none';
        setTimeout(() => { window.location.href = href; }, 400);
      });
    }
  });

});
