// 1. LIVE CLOCK
    function updateClock() {
      const now  = new Date();
      const h    = String(now.getHours()).padStart(2,'0');
      const m    = String(now.getMinutes()).padStart(2,'0');
      const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
      const d    = String(now.getDate()).padStart(2,'0');
      document.getElementById('live-time').textContent = `${h}:${m}`;
      document.getElementById('live-date').textContent = `${days[now.getDay()]} ${d}`;
    }
    updateClock();
    setInterval(updateClock, 1000);

    // 2. STICKY NAVBAR
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });

    // 3. DARK MODE
    const html       = document.documentElement;
    const darkToggle = document.getElementById('dark-toggle');
    const saved      = localStorage.getItem('chronox-theme');
    if (saved) html.setAttribute('data-theme', saved);

    darkToggle.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('chronox-theme', next);
      darkToggle.style.transform = 'rotate(360deg)';
      setTimeout(() => darkToggle.style.transform = '', 400);
    });

    // 4. HAMBURGER MENU
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    mobileMenu.querySelectorAll('.nav-link').forEach(l =>
      l.addEventListener('click', () => mobileMenu.classList.remove('open'))
    );
    document.addEventListener('click', e => {
      if (!header.contains(e.target) && !mobileMenu.contains(e.target))
        mobileMenu.classList.remove('open');
    });

    // 5. SMOOTH SCROLL
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          window.scrollTo({ top: target.offsetTop - header.offsetHeight - 12, behavior: 'smooth' });
        }
      });
    });

    // 6. SCROLL REVEAL
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = `${(i % 3) * 80}ms`;
      observer.observe(el);
    });

    // 7. RIPPLE EFFECT
    document.querySelectorAll('.btn-cta, .btn-plan, .btn-nav-cta').forEach(btn => {
      btn.addEventListener('click', function(e) {
        const rect   = this.getBoundingClientRect();
        const size   = Math.max(rect.width, rect.height);
        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position:absolute; border-radius:50%; pointer-events:none;
          width:${size}px; height:${size}px;
          left:${e.clientX - rect.left - size/2}px;
          top:${e.clientY - rect.top - size/2}px;
          background:rgba(255,255,255,0.28);
          transform:scale(0);
          animation:ripple-anim 0.5s ease-out forwards;
        `;
        this.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      });
    });

    // 8. ACTIVE NAV HIGHLIGHT
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#nav-bar .nav-link');
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - header.offsetHeight - 40) current = s.id;
      });
      navLinks.forEach(l => {
        l.style.background = '';
        l.style.color = '';
        if (l.getAttribute('href') === `#${current}`) {
          l.style.background = 'var(--bg-alt)';
          l.style.color = 'var(--gold)';
        }
      });
    }, { passive: true });