/* ==========================================================
   MANDALINA AKADEMİ – ALTERNATIVE DESIGN INTERACTIONS & FORM
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar Scroll Effect ──
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // ── Mobile Navigation Menu ──
  const hamburger = document.getElementById('navHamburger');
  const navLinks = document.getElementById('navLinks');
  const overlay = document.getElementById('navOverlay');

  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // ── Scroll Reveal System ──
  const reveals = document.querySelectorAll('.reveal, .reveal-stagger');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  // ── Stats Counter Animation ──
  const counters = document.querySelectorAll('.stat-count');
  let animated = false;

  const runCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'));
    const speed = 2000;
    const start = performance.now();

    const animate = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / speed, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      
      const current = Math.round(target * ease);
      
      if (target >= 100 && target !== 97) {
        el.textContent = current + '+';
      } else if (target === 97) {
        el.textContent = '%' + current;
      } else {
        el.textContent = current + '+';
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          counters.forEach((c, idx) => {
            setTimeout(() => runCounter(c), idx * 100);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    statsObserver.observe(statsSection);
  }

  // ── SSS Accordion Toggle ──
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    trigger.addEventListener('click', () => {
      const active = item.classList.contains('active');

      // Close other active items
      accordionItems.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
        other.querySelector('.accordion-icon').textContent = '+';
      });

      if (!active) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        item.querySelector('.accordion-icon').textContent = '−';
      }
    });
  });

  // ── Contact Form Submit with FormSubmit ──
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('.submit-btn');
      const originalText = btn.textContent;

      btn.disabled = true;
      btn.textContent = 'Gönderiliyor...';

      const data = {
        name: contactForm.querySelector('#name').value,
        email: contactForm.querySelector('#email').value,
        message: contactForm.querySelector('#message').value,
        _subject: "Mandalina Akademi (Alternatif) - Yeni Mesaj"
      };

      const email = "info@mandalinaakademi.com"; // Buraya kendi e-postanızı ekleyebilirsiniz.

      fetch(`https://formsubmit.co/ajax/${email}`, {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(resData => {
        if (resData.success === "true" || resData.success === true) {
          btn.textContent = '✓ Mesaj İletildi!';
          btn.style.background = '#25D366';
          contactForm.reset();
        } else {
          throw new Error('Gönderim başarısız.');
        }
      })
      .catch(err => {
        console.error(err);
        btn.textContent = '⚠ Gönderim Başarısız!';
        btn.style.background = '#FF3B30';
      })
      .finally(() => {
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = originalText;
          btn.style.background = '';
        }, 3000);
      });
    });
  }

});
