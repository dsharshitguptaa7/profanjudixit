import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import { initHeroScene } from './visual/heroScene.js';
import { initCrystalScene } from './visual/crystalScene.js';
import { publications, booksAndChapters, publicationStats } from './data/publications.js';
import { researchProjects } from './data/projects.js';
import { patents } from './data/patents.js';
import { researchAreas } from './data/researchAreas.js';
import { leadershipRoles, teachingCourses } from './data/leadership.js';
import { awards } from './data/awards.js';
import { doctoralSupervision } from './data/scholars.js';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Initialize Hero 3D Scene
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) {
    initHeroScene(heroCanvas);
  }

  // 2. Initialize Interactive BaTiO₃ Crystal Inspector
  const crystalCanvas = document.getElementById('crystal-canvas');
  const crystalInfoPanel = document.getElementById('crystal-info-panel');
  let crystalController = null;

  if (crystalCanvas && crystalInfoPanel) {
    crystalController = initCrystalScene(crystalCanvas, crystalInfoPanel);

    // Mode Toggle Buttons
    const btnPara = document.getElementById('btnModeParaelectric');
    const btnFerro = document.getElementById('btnModeFerroelectric');
    const explainerText = document.getElementById('explainerText');

    if (btnPara && btnFerro) {
      btnPara.addEventListener('click', () => {
        btnPara.classList.add('active');
        btnPara.setAttribute('aria-pressed', 'true');
        btnFerro.classList.remove('active');
        btnFerro.setAttribute('aria-pressed', 'false');
        if (crystalController) crystalController.setPolarizationMode(false);
        if (explainerText) {
          explainerText.innerHTML = `In the cubic phase (T &gt; 120 °C), the centrosymmetric structure has zero net dipole moment. Switching to the ferroelectric phase displaces the central Ti⁴⁺ cation relative to the oxygen octahedron, breaking symmetry to produce a permanent macroscopic dipole moment <strong>P⃗</strong>.`;
        }
      });

      btnFerro.addEventListener('click', () => {
        btnFerro.classList.add('active');
        btnFerro.setAttribute('aria-pressed', 'true');
        btnPara.classList.remove('active');
        btnPara.setAttribute('aria-pressed', 'false');
        if (crystalController) crystalController.setPolarizationMode(true);
        if (explainerText) {
          explainerText.innerHTML = `<span style="color:#56D9FF; font-weight:600;">Ferroelectric Phase Activated:</span> The central Ti⁴⁺ ion is displaced upwards along the c-axis by ~0.12 Å while the oxygen octahedron distorts. This breaks inversion symmetry (Pm3̄m → P4mm), giving rise to spontaneous polarization <strong>P⃗</strong>, hysteresis, and giant dielectric permittivity.`;
        }
      });
    }

    // Reset View Button
    const btnResetView = document.getElementById('btnResetView');
    if (btnResetView && crystalController) {
      btnResetView.addEventListener('click', () => {
        crystalController.resetView();
      });
    }

    // Auto-Rotate Button
    const btnToggleRotate = document.getElementById('btnToggleRotate');
    const rotateBtnLabel = document.getElementById('rotateBtnLabel');
    let isSpinning = true;

    if (btnToggleRotate && crystalController) {
      btnToggleRotate.addEventListener('click', () => {
        isSpinning = !isSpinning;
        crystalController.toggleAutoRotate(isSpinning);
        if (rotateBtnLabel) {
          rotateBtnLabel.textContent = isSpinning ? 'Pause Spin' : 'Auto Spin';
        }
      });
    }
  }

  // 3. Render Research Areas
  const researchGrid = document.getElementById('researchAreasGrid');
  if (researchGrid) {
    researchGrid.innerHTML = researchAreas.map(area => `
      <div class="research-card">
        <div class="card-top">
          <div class="card-icon-wrapper">
            ${area.icon}
          </div>
          <span class="card-badge">${area.badge}</span>
          <h3 class="research-title">${area.title}</h3>
          <p class="research-desc">${area.description}</p>
        </div>
        <a href="#publications" class="research-link" data-filter="${area.targetCategory}">
          <span>View Relevant Publications</span>
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>
    `).join('');
  }

  // 4. Render Selected Publications with Live Search and Filters
  const publicationsList = document.getElementById('publicationsList');
  const pubSearchInput = document.getElementById('pubSearchInput');
  const pubCountDisplay = document.getElementById('pubCountDisplay');
  const yearFilterBtns = document.querySelectorAll('.pub-year-filters .filter-pill');

  let activeYear = 'all';
  let searchQuery = '';

  function renderPublications() {
    if (!publicationsList) return;

    const filtered = publications.filter(pub => {
      const matchesYear = (activeYear === 'all') || (pub.year.toString() === activeYear);
      const queryLower = searchQuery.toLowerCase().trim();
      const matchesQuery = !queryLower || 
        pub.title.toLowerCase().includes(queryLower) ||
        pub.journal.toLowerCase().includes(queryLower) ||
        pub.category.toLowerCase().includes(queryLower) ||
        pub.tags.some(t => t.toLowerCase().includes(queryLower));

      return matchesYear && matchesQuery;
    });

    if (pubCountDisplay) {
      pubCountDisplay.textContent = `Showing ${filtered.length} of ${publications.length} Selected Articles`;
    }

    if (filtered.length === 0) {
      publicationsList.innerHTML = `
        <div style="text-align:center; padding:3.5rem; background:var(--bg-card); border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
          <p style="color:var(--text-muted); font-size:1.05rem; margin-bottom:1rem;">No publications matched your search criteria.</p>
          <button class="filter-pill active" id="resetPubFilterBtn">Reset Search & Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('resetPubFilterBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          activeYear = 'all';
          searchQuery = '';
          if (pubSearchInput) pubSearchInput.value = '';
          yearFilterBtns.forEach(b => b.classList.toggle('active', b.dataset.year === 'all'));
          renderPublications();
        });
      }
      return;
    }

    publicationsList.innerHTML = filtered.map(pub => `
      <article class="publication-card" id="${pub.id}">
        <div class="pub-meta-row">
          <span class="pub-year-badge">${pub.year}</span>
          <span class="pub-journal">${pub.journal}</span>
          <span class="pub-type-badge">${pub.type}</span>
          <span class="badge badge-violet" style="margin-left:auto;">${pub.category}</span>
        </div>
        <h3 class="pub-title">${pub.title}</h3>
        <p class="pub-authors">${pub.authors}</p>
        <p class="pub-abstract">${pub.abstract}</p>
        <div class="pub-tags-row">
          ${pub.tags.map(t => `<span class="pub-tag">#${t}</span>`).join('')}
          <button class="copy-cite-btn" data-cite="${encodeURIComponent(`${pub.authors} (${pub.year}). ${pub.title}. ${pub.journal}.`)}">
            <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copy Citation</span>
          </button>
        </div>
      </article>
    `).join('');

    // Attach copy citation listener
    document.querySelectorAll('.copy-cite-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const citeText = decodeURIComponent(btn.dataset.cite);
        navigator.clipboard.writeText(citeText).then(() => {
          showToast('Citation copied to clipboard!');
        });
      });
    });
  }

  if (publicationsList) {
    renderPublications();

    if (pubSearchInput) {
      pubSearchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderPublications();
      });
    }

    yearFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        yearFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeYear = btn.dataset.year;
        renderPublications();
      });
    });

    // Links from Research Areas grid that filter publications
    document.querySelectorAll('.research-link').forEach(link => {
      link.addEventListener('click', () => {
        const cat = link.dataset.filter;
        if (cat && cat !== 'All') {
          searchQuery = cat;
          if (pubSearchInput) pubSearchInput.value = cat;
          renderPublications();
        }
      });
    });
  }

  // 5. Render Books & Scholarly Volumes
  const booksGrid = document.getElementById('booksGrid');
  if (booksGrid) {
    booksGrid.innerHTML = booksAndChapters.map(book => `
      <div class="book-card">
        <div class="book-meta">
          <span class="book-type">${book.type}</span>
          <span class="book-year">${book.year}</span>
        </div>
        <h4 class="book-title">${book.title}</h4>
        <p class="book-publisher">${book.publisher} · <strong>${book.role}</strong></p>
      </div>
    `).join('');
  }

  // 6. Render Research Projects (Ongoing & Completed)
  const ongoingProjectsGrid = document.getElementById('ongoingProjectsGrid');
  if (ongoingProjectsGrid) {
    ongoingProjectsGrid.innerHTML = researchProjects.ongoing.map(proj => `
      <div class="project-card ongoing">
        <div class="project-badge-row">
          <span class="badge badge-cyan">${proj.role}</span>
          <span class="grant-amount">${proj.amount}</span>
        </div>
        <h4 class="project-title">${proj.title}</h4>
        <p class="project-agency">${proj.agency}</p>
        <div class="project-role-duration">
          <span>Duration: <strong>${proj.duration}</strong></span>
          <span>Status: <strong>${proj.status}</strong></span>
        </div>
        <p class="project-desc">${proj.description}</p>
      </div>
    `).join('');
  }

  const completedProjectsGrid = document.getElementById('completedProjectsGrid');
  if (completedProjectsGrid) {
    completedProjectsGrid.innerHTML = researchProjects.completed.map(proj => `
      <div class="project-card completed">
        <div class="project-badge-row">
          <span class="badge badge-violet">${proj.role}</span>
          <span class="grant-amount">${proj.amount}</span>
        </div>
        <h4 class="project-title">${proj.title}</h4>
        <p class="project-agency">${proj.agency}</p>
        <div class="project-role-duration">
          <span>Duration: <strong>${proj.duration}</strong></span>
          <span>Status: <strong>${proj.status}</strong></span>
        </div>
        <p class="project-desc">${proj.description}</p>
      </div>
    `).join('');
  }

  // 7. Render National Patents Directory with Copy Button
  const patentsGrid = document.getElementById('patentsGrid');
  if (patentsGrid) {
    patentsGrid.innerHTML = patents.map(pat => `
      <div class="patent-card">
        <div class="patent-header">
          <span class="patent-field">${pat.field}</span>
          <button class="patent-copy-btn" data-copy="${pat.number}" title="Copy Patent Number">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copy No.</span>
          </button>
        </div>
        <h4 class="patent-title">${pat.title}</h4>
        <p class="patent-desc">${pat.description}</p>
        <div class="patent-footer">
          <span class="patent-number">Patent No: ${pat.number}</span>
          <span class="patent-year">Filed: ${pat.year}</span>
        </div>
      </div>
    `).join('');

    // Attach copy event listeners
    document.querySelectorAll('.patent-copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const textToCopy = btn.dataset.copy;
        if (textToCopy) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            showToast(`Copied Patent No. ${textToCopy} to clipboard!`);
          }).catch(() => {
            showToast(`Patent No. ${textToCopy}`);
          });
        }
      });
    });
  }

  // 8. Render Doctoral Scholars Supervision
  const awardedScholarsList = document.getElementById('awardedScholarsList');
  if (awardedScholarsList) {
    awardedScholarsList.innerHTML = doctoralSupervision.awardedAndSubmitted.map(sch => `
      <div class="scholar-item">
        <div class="scholar-name-row">
          <span class="scholar-name">${sch.scholar}</span>
          <span class="badge ${sch.status.includes('Awarded') ? 'badge-cyan' : 'badge-violet'}">${sch.badge}</span>
        </div>
        <p class="scholar-thesis">${sch.thesis}</p>
        <p class="scholar-focus">${sch.focus}</p>
        <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted); margin-top:0.4rem;">
          Milestone: ${sch.year}
        </div>
      </div>
    `).join('');
  }

  const ongoingScholarsList = document.getElementById('ongoingScholarsList');
  if (ongoingScholarsList) {
    ongoingScholarsList.innerHTML = doctoralSupervision.ongoing.map(sch => `
      <div class="scholar-item">
        <div class="scholar-name-row">
          <span class="scholar-name">${sch.scholar}</span>
          <span class="badge badge-violet">${sch.status}</span>
        </div>
        <p class="scholar-focus" style="margin-top:0.35rem;">Research Area: <strong>${sch.area}</strong></p>
      </div>
    `).join('');
  }

  // 9. Render Leadership Timeline & Teaching Courses
  const leadershipTimeline = document.getElementById('leadershipTimeline');
  if (leadershipTimeline) {
    leadershipTimeline.innerHTML = leadershipRoles.map(role => `
      <div class="timeline-item">
        <div class="timeline-dot ${role.highlight ? 'highlight' : ''}"></div>
        <span class="timeline-period">${role.period}</span>
        <h4 class="timeline-role">${role.role}</h4>
        <p class="timeline-body">${role.body}</p>
        <p class="timeline-desc">${role.description}</p>
      </div>
    `).join('');
  }

  const coursesList = document.getElementById('coursesList');
  if (coursesList) {
    coursesList.innerHTML = teachingCourses.map(course => `
      <div class="course-item">
        <div class="course-top-row">
          <h4 class="course-name">${course.name}</h4>
          <span class="course-code">${course.code}</span>
        </div>
        <div class="course-level">${course.level}</div>
        <p class="course-desc">${course.description}</p>
      </div>
    `).join('');
  }

  // 10. Render Awards & Recognition
  const awardsGrid = document.getElementById('awardsGrid');
  if (awardsGrid) {
    awardsGrid.innerHTML = awards.map(aw => `
      <div class="award-card">
        <div>
          <span class="award-year">${aw.year}</span>
          <h3 class="award-title">${aw.title}</h3>
          <p class="award-org">${aw.organization}</p>
        </div>
        <p class="award-desc">${aw.description}</p>
      </div>
    `).join('');
  }

  // 11. Copy Email Button in Contact Section
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText('anjudixit@csjmu.ac.in').then(() => {
        showToast('Copied email: anjudixit@csjmu.ac.in');
      });
    });
  }

  // 12. Toast Notification Function
  function showToast(msg) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    if (toast && toastMsg) {
      toastMsg.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3400);
    }
  }

  // 13. Mobile Navigation Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 14. Navbar Scroll & Active Section Tracking (Scrollspy)
  const navbar = document.getElementById('navbar');
  const navAnchorElements = document.querySelectorAll('.nav-link');
  const observedSections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Scrollspy
    let currentSectionId = '';
    const scrollPos = window.scrollY + 180;

    observedSections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navAnchorElements.forEach(anchor => {
        anchor.classList.toggle('active', anchor.getAttribute('href') === `#${currentSectionId}`);
      });
    }
  }, { passive: true });

  // 15. FAIL-SAFE PROGRESSIVE SCROLL REVEALS
  // Guaranteed: Academic content is ALWAYS visible by default in CSS.
  // When motion is enabled, elements smoothly float into view as they intersect the viewport,
  // and inline styles are cleared upon completion so they never permanently hide content.
  if (!prefersReducedMotion) {
    // Hero elements reveal on initial load
    gsap.from('.hero-badge-group, .hero-title, .hero-subtitle, .hero-lead, .hero-actions', {
      opacity: 0,
      y: 25,
      stagger: 0.08,
      duration: 0.7,
      ease: 'power3.out',
      clearProps: 'all'
    });

    gsap.from('.hero-stats-bar', {
      opacity: 0,
      y: 20,
      duration: 0.7,
      delay: 0.35,
      ease: 'power3.out',
      clearProps: 'all'
    });

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = entry.target;
            observer.unobserve(target);

            if (target.classList.contains('section-header')) {
              gsap.fromTo(target, 
                { opacity: 0, y: 24 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', clearProps: 'all' }
              );
            } else {
              const cards = target.querySelectorAll('.research-card, .impact-card, .project-card, .patent-card, .award-card, .book-card, .scholar-item, .milestone-card');
              if (cards.length > 0) {
                gsap.fromTo(cards,
                  { opacity: 0, y: 26 },
                  { opacity: 1, y: 0, stagger: 0.06, duration: 0.6, ease: 'power2.out', clearProps: 'all' }
                );
              }
            }
          }
        });
      }, {
        rootMargin: '0px 0px -30px 0px',
        threshold: 0.05
      });

      // Observe all section headers
      document.querySelectorAll('.section-header').forEach(header => {
        revealObserver.observe(header);
      });

      // Observe all card grids and containers
      const cardSelectors = [
        '#researchAreasGrid',
        '.projects-container',
        '#patentsGrid',
        '#awardsGrid',
        '.impact-grid',
        '#booksGrid',
        '.scholars-container',
        '.academic-milestones-grid'
      ];
      cardSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => revealObserver.observe(el));
      });
    }

    // Safety fallback: guaranteed visibility for all content after 1.5s
    setTimeout(() => {
      document.querySelectorAll('.research-card, .project-card, .patent-card, .award-card, .impact-card, .section-header, .book-card, .scholar-item, .milestone-card').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.visibility = 'visible';
      });
    }, 1500);

    // Hash navigation / anchor click instant visibility
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash;
      if (hash) {
        const target = document.querySelector(hash);
        if (target) {
          target.querySelectorAll('.research-card, .project-card, .patent-card, .award-card, .impact-card, .section-header, .book-card, .scholar-item, .milestone-card').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.visibility = 'visible';
          });
        }
      }
    });
  }

  // 16. Animated Counters for Academic Impact (GSAP ScrollTrigger or Counter)
  const impactCards = document.querySelectorAll('.impact-number');
  let animatedImpact = false;

  const impactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animatedImpact) {
        animatedImpact = true;
        impactCards.forEach(el => {
          const target = parseInt(el.getAttribute('data-target'), 10);
          if (isNaN(target)) return;

          let current = 0;
          const duration = 1600;
          const stepTime = 30;
          const totalSteps = duration / stepTime;
          const stepValue = target / totalSteps;

          const timer = setInterval(() => {
            current += stepValue;
            if (current >= target) {
              current = target;
              clearInterval(timer);
              el.textContent = (target === 61 || target === 19) ? `${target}+` : `${target}`;
            } else {
              el.textContent = Math.floor(current).toString();
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.25 });

  const impactSection = document.getElementById('impact');
  if (impactSection) {
    impactObserver.observe(impactSection);
  }

  // 17. Interactive Spotlight Card Cursor Hover Effect
  document.querySelectorAll('.research-card, .patent-card, .impact-card, .project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
});
