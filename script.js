/* ============================================
   MANDALINA AKADEMİ – Interactions & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar Scroll Effect ──
  const navbar = document.getElementById('navbar');

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ── Mobile Nav ──
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

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // ── Smooth Scroll for Anchor Links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Scroll Reveal ──
  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ── Stat Counter Animation ──
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let statsAnimated = false;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const startTime = performance.now();

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);

      el.textContent = Math.round(target * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        // Add suffix
        if (target >= 100 && target !== 97) {
          el.textContent = target + '+';
        } else if (target === 97) {
          el.textContent = '%' + target;
        } else {
          el.textContent = target + '+';
        }
      }
    };

    requestAnimationFrame(updateCount);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNumbers.forEach((el, index) => {
          setTimeout(() => animateCounter(el), index * 150);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // ── Contact Form ──
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('.btn-primary');
      const originalHTML = btn.innerHTML;

      // Butonu devre dışı bırak ve yükleniyor durumunu göster
      btn.disabled = true;
      btn.innerHTML = '<span class="btn-text">Gönderiliyor...</span>';

      const formData = {
        name: contactForm.querySelector('#name').value,
        email: contactForm.querySelector('#email').value,
        message: contactForm.querySelector('#message').value,
        _subject: "Mandalina Akademi - Yeni İletişim Formu Mesajı"
      };

      // Alıcı E-posta adresi (Formun gideceği e-posta)
      // İlk gönderimde FormSubmit bu adrese bir onay/aktivasyon maili gönderir.
      const targetEmail = "info@mandalinaakademi.com"; 

      fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(data => {
        if (data.success === "true" || data.success === true) {
          // Başarılı gönderim animasyonu
          btn.innerHTML = '<span class="btn-text">✓ Gönderildi!</span>';
          btn.style.background = 'linear-gradient(135deg, #25D366, #20BD5A)';
          contactForm.reset();
        } else {
          throw new Error(data.message || "Gönderim başarısız");
        }
      })
      .catch(error => {
        console.error(error);
        // Hata durumunda animasyon
        btn.innerHTML = '<span class="btn-text">⚠ Hata Oluştu!</span>';
        btn.style.background = 'linear-gradient(135deg, #FF3B30, #D32F2F)';
      })
      .finally(() => {
        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = originalHTML;
          btn.style.background = '';
        }, 3000);
      });
    });
  }

  // ── Parallax Orbs (subtle mouse move) ──
  const orbs = document.querySelectorAll('.hero-orb');

  if (window.innerWidth > 768) {
    let ticking = false;

    document.addEventListener('mousemove', (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const x = (e.clientX / window.innerWidth - 0.5) * 2;
          const y = (e.clientY / window.innerHeight - 0.5) * 2;

          orbs.forEach((orb, index) => {
            const speed = (index + 1) * 8;
            orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
          });

          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ── Active Nav Link Highlight ──
  const sections = document.querySelectorAll('section[id]');

  const navHighlight = () => {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.querySelectorAll('a').forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${sectionId}` && !link.classList.contains('nav-cta')) {
            link.style.color = '#F0F6FC';
          }
        });
      }
    });
  };

  window.addEventListener('scroll', navHighlight, { passive: true });

  // ── Keyboard Accessibility ──
  hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  });

  hamburger.setAttribute('tabindex', '0');
  hamburger.setAttribute('role', 'button');
  hamburger.setAttribute('aria-label', 'Menüyü aç/kapa');

  // ── FAQ Accordion Interaction ──
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionButton = item.querySelector('.faq-question');
    
    questionButton.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close other open accordion items (optional, but clean)
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        otherItem.querySelector('.faq-icon').textContent = '+';
      });

      if (!isActive) {
        item.classList.add('active');
        questionButton.setAttribute('aria-expanded', 'true');
        item.querySelector('.faq-icon').textContent = '−'; // minus icon when open
      }
    });
  });

});

