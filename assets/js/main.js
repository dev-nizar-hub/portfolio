document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  /* CURSOR */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;
  
  if (window.innerWidth > 900) {
    document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
    function animateCursor() {
      cursor.style.left = mouseX + 'px'; cursor.style.top = mouseY + 'px';
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      follower.style.left = followerX + 'px'; follower.style.top = followerY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  } else {
    // Disable on mobile
    if(cursor) cursor.style.display = 'none';
    if(follower) follower.style.display = 'none';
  }

  /* LOADER */
  function initLoader() {
    // Professional Ease vs "AI" bounce. Using smooth sine and power3 curves.
    const bar = document.getElementById('loader-bar');
    const pct = document.getElementById('loader-percent');
    const loaderName = document.getElementById('loader-name');
    const loader = document.getElementById('loader');

    const tl = gsap.timeline({ onComplete: startHero });
    tl.to(bar, { width: '100%', duration: 1.4, ease: 'power2.inOut',
      onUpdate: function() {
        const p = Math.round(this.progress() * 100);
        pct.textContent = p + '%';
      }
    })
    .to(loaderName, { opacity: 0, duration: 0.6, ease: 'sine.inOut' }, '-=0.2')
    .to(loader, { opacity: 0, duration: 0.8, ease: 'sine.inOut' }, '+=0.1')
    .set(loader, { display: 'none' });
  }

  /* HERO */
  function startHero() {
    const tag = document.getElementById('hero-tag');
    const desc = document.getElementById('hero-desc');
    const scroll = document.getElementById('hero-scroll');
    const titleEl = document.getElementById('hero-title') || document.querySelector('.cv-title');
    const imageSide = document.getElementById('hero-image') || document.querySelector('.cv-profile-img');

    if(tag) gsap.set(tag, { opacity: 0 });
    if(desc) gsap.set(desc, { opacity: 0 });
    if(scroll) gsap.set(scroll, { opacity: 0 });
    if(imageSide) gsap.set(imageSide, { opacity: 0, y: 30 });

    if(titleEl) {
      // Case-insensitive split so it works across all browsers (some normalise <br> to <BR>)
      const titleLines = titleEl.innerHTML.split(/<br\s*\/?>/i);
      titleEl.innerHTML = titleLines.map(l => `<div style="overflow:hidden"><div class="title-line">${l}</div></div>`).join('');
      gsap.set('.title-line', { y: '100%' });
    }

    const tl = gsap.timeline();
    if(titleEl) {
      tl.to('.title-line', { y: '0%', duration: 1, ease: 'power4.out', stagger: 0.15 });
    }
    
    if(tag) tl.to(tag, { opacity: 1, duration: 0.8, ease: 'sine.out' }, '-=0.8');
    if(desc) tl.to(desc, { opacity: 1, duration: 0.8, ease: 'sine.out' }, '-=0.6');
    if(imageSide) tl.to(imageSide, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '-=0.6');
    if(scroll) tl.to(scroll, { opacity: 1, duration: 0.8 }, '-=0.3');

    initScrollAnimations();
  }

  /* SCROLL ANIMATIONS */
  function initScrollAnimations() {

    /* NAV */
    ScrollTrigger.create({
      start: 50,
      onEnter: () => document.getElementById('navbar').classList.add('scrolled'),
      onLeaveBack: () => document.getElementById('navbar').classList.remove('scrolled')
    });

    const initSectionGlobals = (sectionSelector) => {
      const section = document.querySelector(sectionSelector);
      if (!section) return;

      const label = section.querySelector('.section-label');
      if (label) {
        gsap.fromTo(label, 
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: label, start: 'top 85%' }
        });
      }

      const title = section.querySelector('.section-title');
      if (title) {
        if (!title.querySelector('.st-inner')) {
          const html = title.innerHTML;
          title.innerHTML = `<div style="overflow:hidden"><div class="st-inner">${html}</div></div>`;
        }
        gsap.fromTo(title.querySelector('.st-inner'), 
          { y: '100%' },
          { y: '0%', duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: title, start: 'top 85%' } }
        );
      }
    };

    /* 1. ABOUT SECTION */
    initSectionGlobals('#about');
    gsap.utils.toArray('#about .about-text p, #about .delivered-meals, #about .about-links').forEach((el, i) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: i * 0.1,
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });

    gsap.utils.toArray('.skill-item').forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el, start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'sine.inOut' });
          const pct = el.dataset.skill;
          gsap.to(el.querySelector('.skill-bar-fill'), { 
            width: pct + '%', 
            duration: 1.4, 
            ease: 'power3.out',
            delay: 0.2 
          });
        }
      });
    });

    /* 2. SERVICES SECTION */
    initSectionGlobals('#services');
    gsap.utils.toArray('.service-card').forEach((el, i) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: i * 0.08,
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });

    /* 3. WORK SECTION */
    initSectionGlobals('#work');
    const wf = document.getElementById('work-filter');
    if (wf) {
      gsap.to(wf, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: wf, start: 'top 88%' }
      });
      gsap.set(wf, { y: 20 });
    }
    gsap.utils.toArray('.work-card').forEach((el, i) => {
      gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: i * 0.1,
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
      gsap.set(el, { y: 40 });
    });

    /* 4. TIMELINE & CV BLOCKS */
    initSectionGlobals('#timeline');
    gsap.utils.toArray('.timeline-item, .cv-block, .cv-contact-item').forEach((el, i) => {
      gsap.fromTo(el, 
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });

    gsap.utils.toArray('.cv-tag').forEach((el, i) => {
      gsap.fromTo(el, 
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)', delay: i * 0.05,
        scrollTrigger: { trigger: el, start: 'top 90%' }
      });
    });

    /* 5. CONTACT SECTION */
    initSectionGlobals('#contact');
    gsap.utils.toArray('.contact-info p, .contact-links, .contact-form').forEach((el, i) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: i * 0.1,
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });

    /* PARALLAX DATA-SPEED */
    gsap.utils.toArray('[data-speed]').forEach(el => {
      const speed = parseFloat(el.getAttribute('data-speed')) || 0;
      gsap.to(el, {
        y: () => (ScrollTrigger.maxScroll(window) * speed),
        ease: 'none',
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1
        }
      });
    });

    /* Ensure precise recalculation of positions */
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  }

  /* 3D TILT EFFECT */
  const tiltWrappers = document.querySelectorAll('.tilt-wrapper');
  tiltWrappers.forEach(wrapper => {
    const inner = wrapper.querySelector('.tilt-inner');
    if(!inner) return;
    wrapper.addEventListener('mousemove', e => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPct = x / rect.width - 0.5;
      const yPct = y / rect.height - 0.5;
      
      gsap.to(inner, {
        rotationY: xPct * 20, 
        rotationX: -yPct * 20,
        transformPerspective: 1000,
        ease: 'power2.out',
        duration: 0.6
      });
    });
    wrapper.addEventListener('mouseleave', () => {
      gsap.to(inner, { rotationY: 0, rotationX: 0, duration: 0.8, ease: 'power2.out' });
    });
  });

  /* WORK FILTER LOGIC */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.dataset.filter;
      document.querySelectorAll('.work-card').forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        gsap.to(card, { opacity: match ? 1 : 0.2, scale: match ? 1 : 0.97, duration: 0.35 });
      });
    });
  });



  /* FORM OVERRIDE */
  document.getElementById('contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = document.getElementById('form-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    
    setTimeout(() => {
      btn.textContent = 'Message sent ✓';
      btn.style.background = '#0d0d0d'; // darker color instead of full green for premium style
      btn.style.color = '#fff';
      e.target.reset();
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
      }, 3000);
    }, 800);
  });

  /* MOBILE MENU LOGIC */
  document.getElementById('menuToggle')?.addEventListener('click', function() {
    const links = document.querySelector('.nav-links');
    const isOpen = links.style.display === 'flex';
    
    if (isOpen) {
      gsap.to(links, { 
        opacity: 0, 
        y: -10, 
        duration: 0.3, 
        ease: 'power2.in',
        onComplete: () => links.style.display = 'none' 
      });
    } else {
      links.style.cssText = 'display:flex; flex-direction:column; position:fixed; top:80px; left:0; right:0; background:var(--white); padding:32px 28px 40px; gap:24px; border-bottom: 1px solid var(--gray-light); z-index:99;';
      gsap.fromTo(links, 
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  });

  /* Close mobile menu when any nav link is clicked */
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      const links = document.querySelector('.nav-links');
      if (links && links.style.display === 'flex') {
        gsap.to(links, {
          opacity: 0, y: -10, duration: 0.25, ease: 'power2.in',
          onComplete: () => links.style.display = 'none'
        });
      }
    });
  });

  /* START THE EXECUTION */
  // Use 'load' for fonts/images; fall back immediately if already fired.
  if (document.readyState === 'complete') {
    initLoader();
  } else {
    window.addEventListener('load', initLoader);
  }
});
