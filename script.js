/**
 * ============================================================================
 * C. SANJAI - PERSONAL PORTFOLIO INTERACTIVITY SCRIPT
 * Electronics and Communication Engineering • Chennai Institute of Technology
 * Class of 2030
 * ============================================================================
 * 
 * TABLE OF CONTENTS:
 * 1. Global Utilities & Page Loader
 * 2. Theme Switcher (Dark / Light Mode)
 * 3. Mobile Navigation Drawer
 * 4. Scrollspy & Header Behavior
 * 5. Hero Background Particle Canvas
 * 6. Hero Dynamic Typing Animation
 * 7. Scroll-Reveal Observer & Skill Progress Bars
 * 8. Skills Category Filter
 * 9. Interactive Modals Manager (Solar Demo, Projects, Certificates, Resume)
 * 10. SAN SOLAR Dynamic Capacity Calculator
 * 11. Contact Form Client-Side Validation & Mailto Trigger
 * 12. Toast Notification System & Back to Top
 * 13. Dynamic Footer Year
 * ============================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. GLOBAL UTILITIES & PAGE LOADER
     ========================================================================== */
  const pageLoader = document.getElementById('pageLoader');
  
  // Fade out loader smoothly once page assets have initialized
  window.addEventListener('load', () => {
    if (pageLoader) {
      setTimeout(() => {
        pageLoader.classList.add('fade-out');
      }, 150);
    }
  });

  // Fallback in case window load takes too long
  setTimeout(() => {
    if (pageLoader && !pageLoader.classList.contains('fade-out')) {
      pageLoader.classList.add('fade-out');
    }
  }, 1200);


  /* ==========================================================================
     2. THEME SWITCHER (DARK / LIGHT MODE)
     ========================================================================== */
  const themeToggle = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or detect system preference
  const savedTheme = localStorage.getItem('sanjai_portfolio_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'dark'); // Defaults to dark as requested

  htmlRoot.setAttribute('data-theme', initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('sanjai_portfolio_theme', newTheme);
      
      showToast(newTheme === 'dark' ? '🌙 Dark theme activated' : '☀️ Light theme activated');
    });
  }


  /* ==========================================================================
     3. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileMenu = (forceClose = false) => {
    if (!mobileMenuBtn || !mobileDrawer) return;
    
    const isOpen = forceClose ? true : mobileMenuBtn.classList.contains('is-active');
    
    if (isOpen) {
      mobileMenuBtn.classList.remove('is-active');
      mobileDrawer.classList.remove('is-open');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    } else {
      mobileMenuBtn.classList.add('is-active');
      mobileDrawer.classList.add('is-open');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      // Prevent body scrolling when menu is open on mobile
      document.body.style.overflow = 'hidden';
    }
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => toggleMobileMenu());
  }

  // Close mobile drawer when any link is clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(true);
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('is-open')) {
      toggleMobileMenu(true);
    }
  });


  /* ==========================================================================
     4. SCROLLSPY & HEADER SCROLL BEHAVIOR
     ========================================================================== */
  const header = document.getElementById('header');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const trackedSections = document.querySelectorAll('section[id]');

  const handleHeaderScroll = () => {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Scrollspy via IntersectionObserver
  const scrollspyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Update desktop links
        desktopNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        // Update mobile links
        mobileNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -65% 0px',
    threshold: 0
  });

  trackedSections.forEach(sec => scrollspyObserver.observe(sec));
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();


  /* ==========================================================================
     5. HERO BACKGROUND PARTICLE CANVAS (CONSTELLATION EFFECT)
     ========================================================================== */
  const canvas = document.getElementById('heroCanvas');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = 0;
    let height = 0;
    let particles = [];
    const maxParticles = window.innerWidth < 768 ? 32 : 65;
    const maxDistance = 120;
    const mouse = { x: null, y: null, radius: 100 };

    const resizeCanvas = () => {
      const heroSection = canvas.parentElement;
      width = canvas.width = heroSection.clientWidth;
      height = canvas.height = heroSection.clientHeight;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1;
        this.baseAlpha = Math.random() * 0.4 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce on boundaries
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Subtle mouse repulsion
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 1.5;
            this.y -= (dy / dist) * force * 1.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${this.baseAlpha})`;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
      }
    };

    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.22;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 210, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      drawLines();
      animationFrameId = requestAnimationFrame(animateParticles);
    };

    window.addEventListener('resize', () => {
      resizeCanvas();
    });

    // Track mouse over canvas
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      } else {
        mouse.x = null;
        mouse.y = null;
      }
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Pause animation when hero is offscreen to preserve battery & performance
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!animationFrameId) animateParticles();
        } else {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      });
    }, { threshold: 0.1 });

    const heroSection = document.getElementById('home');
    if (heroSection) heroObserver.observe(heroSection);

    resizeCanvas();
    initParticles();
    animateParticles();
  }


  /* ==========================================================================
     6. HERO DYNAMIC TYPING ANIMATION
     ========================================================================== */
  const roleCycler = document.getElementById('roleCycler');
  
  if (roleCycler && !prefersReducedMotion) {
    const roles = [
      'ECE Undergraduate',
      'Technology Enthusiast',
      'Future Innovator',
      'Web Developer',
      'Circuit & Hardware Explorer'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    const typeRole = () => {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        roleCycler.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
      } else {
        roleCycler.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 90;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        // Pause at full word
        isDeleting = true;
        typingSpeed = 1800;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 350;
      }

      setTimeout(typeRole, typingSpeed);
    };

    setTimeout(typeRole, 600);
  }


  /* ==========================================================================
     7. SCROLL-REVEAL OBSERVER & SKILL PROGRESS BARS
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');

        // Animate skill bar fills if inside this element
        const progressFills = entry.target.querySelectorAll('.progress-fill');
        progressFills.forEach(fill => {
          fill.classList.add('animate-in');
        });

        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.12
  });

  revealElements.forEach(el => revealObserver.observe(el));


  /* ==========================================================================
     8. SKILLS CATEGORY FILTER
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });


  /* ==========================================================================
     9. INTERACTIVE MODALS MANAGER
     ========================================================================== */
  const allModals = document.querySelectorAll('.modal-backdrop');
  const closeModalButtons = document.querySelectorAll('[data-close-modal]');

  // Function to open a modal by ID
  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button inside for accessibility
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) closeBtn.focus();
  };

  // Function to close all or a specific modal
  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  closeModalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-close-modal');
      const targetModal = document.getElementById(targetId);
      closeModal(targetModal);
    });
  });

  // Close when clicking modal backdrop outside modal-container
  allModals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      allModals.forEach(m => {
        if (m.classList.contains('is-open')) closeModal(m);
      });
    }
  });

  /* Modal Trigger 1: SAN SOLAR Interactive Demo Button */
  const solarModalTriggers = document.querySelectorAll('.open-solar-modal-btn');
  solarModalTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      openModal('solarModal');
    });
  });

  /* Modal Trigger 2: Project Details Case Study Modal */
  const projectDetailButtons = document.querySelectorAll('.open-project-details-btn');
  const projectDetailsModal = document.getElementById('projectDetailsModal');
  const projectDetailsTag = document.getElementById('projectDetailsTag');
  const projectDetailsTitle = document.getElementById('projectDetailsTitle');
  const projectDetailsBody = document.getElementById('projectDetailsBody');

  const projectData = {
    sansolar: {
      tag: 'CASE STUDY // GREEN TECH & WEB',
      title: 'SAN SOLAR Customer Application',
      content: `
        <div class="project-modal-content">
          <p><strong>Overview:</strong> The SAN SOLAR platform was developed to streamline the customer discovery and quotation process for residential solar installations.</p>
          <br>
          <h4>Core Engineering Objectives:</h4>
          <ul style="padding-left: 20px; margin: 10px 0 16px 0; color: var(--text-secondary);">
            <li><strong>Rooftop Capacity Algorithm:</strong> Provides instant estimations based on usable surface area, panel wattage, and geographic solar irradiance multipliers.</li>
            <li><strong>Customer Consultation Capture:</strong> Collects user contact details, address, energy usage trends, and submits inquiries for technical consultation.</li>
            <li><strong>Intuitive Visualization:</strong> Clean glassmorphic design displaying estimated power generation (kWh), cost projections, and CO₂ offset.</li>
          </ul>
          <h4>Technologies Used:</h4>
          <p style="color: var(--accent-cyan); font-family: var(--font-mono); font-size: 0.9rem;">HTML5 • CSS3 (Flexbox/Grid/Variables) • Vanilla JavaScript (Event listeners & DOM math)</p>
        </div>
      `
    },
    portfolio: {
      tag: 'ARCHITECTURE // DEV PORTFOLIO',
      title: 'Personal Developer Portfolio',
      content: `
        <div class="project-modal-content">
          <p><strong>Overview:</strong> A bespoke, responsive developer website designed to communicate academic rigor, ongoing projects, and passion for technology.</p>
          <br>
          <h4>Key Engineering Highlights:</h4>
          <ul style="padding-left: 20px; margin: 10px 0 16px 0; color: var(--text-secondary);">
            <li><strong>High-Contrast Dark Theme:</strong> Sleek obsidian palette with electric cyan and violet gradients for an authoritative tech aesthetic.</li>
            <li><strong>Zero External Framework Dependencies:</strong> Built completely in vanilla HTML5, CSS3, and JavaScript for lightning-fast 100/100 performance scores.</li>
            <li><strong>Interactive Modules:</strong> Includes theme toggle, solar calculator demo, scrollspy, dynamic typewriter effect, and interactive modal dialogs.</li>
          </ul>
        </div>
      `
    },
    future: {
      tag: 'ROADMAP // EMBEDDED & IOT INNOVATION',
      title: 'Smart IoT & Sensor Prototype',
      content: `
        <div class="project-modal-content">
          <p><strong>Overview:</strong> Exploratory research initiative at Chennai Institute of Technology combining microcontroller hardware with telemetry.</p>
          <br>
          <h4>Planned Milestones:</h4>
          <ul style="padding-left: 20px; margin: 10px 0 16px 0; color: var(--text-secondary);">
            <li><strong>Phase 1:</strong> Sensor interfacing (temperature, humidity, energy consumption) using Arduino / ESP32.</li>
            <li><strong>Phase 2:</strong> Wireless protocol implementation (MQTT / HTTP REST telemetry) to publish metrics to an online dashboard.</li>
            <li><strong>Phase 3:</strong> PCB circuit design and fabrication in ECE laboratories.</li>
          </ul>
          <p style="margin-top: 10px; font-style: italic; color: var(--text-muted);">Status: Active research &amp; literature review phase.</p>
        </div>
      `
    }
  };

  projectDetailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-project');
      const data = projectData[key];
      if (data && projectDetailsModal) {
        projectDetailsTag.textContent = data.tag;
        projectDetailsTitle.textContent = data.title;
        projectDetailsBody.innerHTML = data.content;
        openModal('projectDetailsModal');
      }
    });
  });

  /* Modal Trigger 3: Certificate Lightbox Modal */
  const viewCertButtons = document.querySelectorAll('.view-cert-btn');
  const certModal = document.getElementById('certModal');
  const certModalTitle = document.getElementById('certModalTitle');
  const certModalIssuer = document.getElementById('certModalIssuer');
  const certModalDate = document.getElementById('certModalDate');
  const certModalImg = document.getElementById('certModalImg');
  const downloadCertBtn = document.getElementById('downloadCertBtn');
  const openCertNewTabBtn = document.getElementById('openCertNewTabBtn');
  const certModalNote = document.getElementById('certModalNote');

  viewCertButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-cert-title') || 'Certificate of Completion';
      const issuer = btn.getAttribute('data-cert-issuer') || 'Issuing Authority';
      const date = btn.getAttribute('data-cert-date') || '2024';
      const imgSrc = btn.getAttribute('data-cert-img') || 'assets/cert-iitm-datascience-ai.png';
      const note = btn.getAttribute('data-cert-note') || `Official verified credential awarded by ${issuer}.`;

      if (certModal) {
        if (certModalTitle) certModalTitle.textContent = title;
        if (certModalIssuer) certModalIssuer.textContent = issuer.toUpperCase();
        if (certModalDate) certModalDate.textContent = `Completed: ${date} • Verified Technical Milestone`;
        if (certModalImg) {
          certModalImg.setAttribute('src', imgSrc);
          certModalImg.setAttribute('alt', `${title} - Certificate`);
        }
        if (downloadCertBtn) {
          downloadCertBtn.setAttribute('href', imgSrc);
          const safeName = title.replace(/[^a-zA-Z0-9]/g, '_') + '_Certificate.png';
          downloadCertBtn.setAttribute('download', safeName);
        }
        if (openCertNewTabBtn) {
          openCertNewTabBtn.setAttribute('href', imgSrc);
        }
        if (certModalNote) {
          certModalNote.innerHTML = `<em>${note}</em>`;
        }
        openModal('certModal');
      }
    });
  });

  /* Modal Trigger 4: Resume Viewer Modal & Tab Controls */
  const viewResumeBtn = document.getElementById('viewResumeBtn');
  const tabPdfResume = document.getElementById('tabPdfResume');
  const tabDigitalResume = document.getElementById('tabDigitalResume');
  const pdfResumePane = document.getElementById('pdfResumePane');
  const digitalResumePane = document.getElementById('digitalResumePane');

  const setResumeViewTab = (mode) => {
    if (mode === 'pdf') {
      if (tabPdfResume) {
        tabPdfResume.classList.add('active');
        tabPdfResume.setAttribute('aria-selected', 'true');
      }
      if (tabDigitalResume) {
        tabDigitalResume.classList.remove('active');
        tabDigitalResume.setAttribute('aria-selected', 'false');
      }
      if (pdfResumePane) pdfResumePane.style.display = 'block';
      if (digitalResumePane) digitalResumePane.style.display = 'none';
    } else {
      if (tabDigitalResume) {
        tabDigitalResume.classList.add('active');
        tabDigitalResume.setAttribute('aria-selected', 'true');
      }
      if (tabPdfResume) {
        tabPdfResume.classList.remove('active');
        tabPdfResume.setAttribute('aria-selected', 'false');
      }
      if (digitalResumePane) digitalResumePane.style.display = 'block';
      if (pdfResumePane) pdfResumePane.style.display = 'none';
    }
  };

  if (tabPdfResume && tabDigitalResume) {
    tabPdfResume.addEventListener('click', () => setResumeViewTab('pdf'));
    tabDigitalResume.addEventListener('click', () => setResumeViewTab('digital'));
  }

  if (viewResumeBtn) {
    viewResumeBtn.addEventListener('click', () => {
      setResumeViewTab('pdf');
      openModal('resumeModal');
    });
  }


  /* ==========================================================================
     10. SAN SOLAR DYNAMIC CAPACITY CALCULATOR
     ========================================================================== */
  const solarAreaInput = document.getElementById('solarAreaInput');
  const solarAreaRange = document.getElementById('solarAreaRange');
  const calcKw = document.getElementById('calcKw');
  const calcPanels = document.getElementById('calcPanels');
  const calcUnits = document.getElementById('calcUnits');
  const calcCarbon = document.getElementById('calcCarbon');

  const updateSolarCalculations = (areaSqFt) => {
    const area = Math.max(50, Math.min(10000, Number(areaSqFt) || 800));
    
    // Solar standard estimation: ~100 sq ft per 1 kWp installed capacity
    const capacityKw = (area / 100).toFixed(1);
    
    // Approx 450W per modern residential panel
    const estimatedPanels = Math.round((capacityKw * 1000) / 450);
    
    // Average 4 peak sun hours per day in Chennai region (~1,460 kWh per kWp annually)
    const annualUnits = Math.round(capacityKw * 1460);
    
    // 0.82 kg CO2 avoided per kWh in clean solar generation
    const carbonOffsetTons = ((annualUnits * 0.82) / 1000).toFixed(1);

    if (calcKw) calcKw.textContent = `${capacityKw} kWp`;
    if (calcPanels) calcPanels.textContent = `${estimatedPanels} Panels`;
    if (calcUnits) calcUnits.textContent = `${annualUnits.toLocaleString()} kWh`;
    if (calcCarbon) calcCarbon.textContent = `${carbonOffsetTons} Metric Tons`;
  };

  if (solarAreaInput && solarAreaRange) {
    solarAreaInput.addEventListener('input', (e) => {
      const val = e.target.value;
      solarAreaRange.value = val;
      updateSolarCalculations(val);
    });

    solarAreaRange.addEventListener('input', (e) => {
      const val = e.target.value;
      solarAreaInput.value = val;
      updateSolarCalculations(val);
    });

    // Initial calculation run
    updateSolarCalculations(solarAreaInput.value);
  }


  /* ==========================================================================
     11. CONTACT FORM CLIENT-SIDE VALIDATION & REAL MAILTO TRIGGER
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const subjectInput = document.getElementById('contactSubject');
  const messageInput = document.getElementById('contactMessage');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const subjectError = document.getElementById('subjectError');
  const messageError = document.getElementById('messageError');

  // Email regex validator
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return emailRegex.test(email);
  };

  const validateField = (input, errorEl, condition, errorMsg) => {
    if (!condition) {
      input.classList.add('is-invalid');
      if (errorEl) errorEl.textContent = errorMsg;
      return false;
    } else {
      input.classList.remove('is-invalid');
      if (errorEl) errorEl.textContent = '';
      return true;
    }
  };

  // Real-time blur listeners
  if (nameInput) {
    nameInput.addEventListener('blur', () => {
      validateField(nameInput, nameError, nameInput.value.trim().length >= 2, 'Please enter your full name (at least 2 letters).');
    });
    nameInput.addEventListener('input', () => {
      if (nameInput.classList.contains('is-invalid')) {
        validateField(nameInput, nameError, nameInput.value.trim().length >= 2, 'Please enter your full name (at least 2 letters).');
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      validateField(emailInput, emailError, isValidEmail(emailInput.value.trim()), 'Please enter a valid email address (e.g. name@domain.com).');
    });
    emailInput.addEventListener('input', () => {
      if (emailInput.classList.contains('is-invalid')) {
        validateField(emailInput, emailError, isValidEmail(emailInput.value.trim()), 'Please enter a valid email address (e.g. name@domain.com).');
      }
    });
  }

  if (subjectInput) {
    subjectInput.addEventListener('blur', () => {
      validateField(subjectInput, subjectError, subjectInput.value.trim().length >= 3, 'Please enter a subject (at least 3 characters).');
    });
    subjectInput.addEventListener('input', () => {
      if (subjectInput.classList.contains('is-invalid')) {
        validateField(subjectInput, subjectError, subjectInput.value.trim().length >= 3, 'Please enter a subject (at least 3 characters).');
      }
    });
  }

  if (messageInput) {
    messageInput.addEventListener('blur', () => {
      validateField(messageInput, messageError, messageInput.value.trim().length >= 10, 'Please write a message of at least 10 characters.');
    });
    messageInput.addEventListener('input', () => {
      if (messageInput.classList.contains('is-invalid')) {
        validateField(messageInput, messageError, messageInput.value.trim().length >= 10, 'Please write a message of at least 10 characters.');
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput, nameError, nameInput.value.trim().length >= 2, 'Please enter your full name (at least 2 letters).');
      const isEmailValid = validateField(emailInput, emailError, isValidEmail(emailInput.value.trim()), 'Please enter a valid email address.');
      const isSubjectValid = validateField(subjectInput, subjectError, subjectInput.value.trim().length >= 3, 'Please enter a subject.');
      const isMessageValid = validateField(messageInput, messageError, messageInput.value.trim().length >= 10, 'Please write a message of at least 10 characters.');

      if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
        showToast('⚠️ Please fix the highlighted errors before submitting.');
        return;
      }

      // Collect data
      const name = encodeURIComponent(nameInput.value.trim());
      const email = encodeURIComponent(emailInput.value.trim());
      const subject = encodeURIComponent(subjectInput.value.trim());
      const message = encodeURIComponent(messageInput.value.trim());

      // Target recipient: Replace with Sanjai's verified email address
      const recipient = 'sanjai.ece.cit@example.com';
      const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=From:%20${name}%20(${email})%0A%0A${message}`;

      showToast('🚀 Opening your email client to send message...');

      // Trigger mail client
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 500);

      // Reset form
      contactForm.reset();
      nameInput.classList.remove('is-invalid');
      emailInput.classList.remove('is-invalid');
      subjectInput.classList.remove('is-invalid');
      messageInput.classList.remove('is-invalid');
    });
  }


  /* ==========================================================================
     12. TOAST NOTIFICATION SYSTEM & BACK TO TOP BUTTON
     ========================================================================== */
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimeout;

  function showToast(message, duration = 3500) {
    if (!toastNotification || !toastMessage) return;
    
    toastMessage.textContent = message;
    toastNotification.classList.add('is-visible');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNotification.classList.remove('is-visible');
    }, duration);
  }

  // Back to Top Button
  const backToTopBtn = document.getElementById('backToTopBtn');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  /* ==========================================================================
     13. DYNAMIC FOOTER CURRENT YEAR
     ========================================================================== */
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

});
