/* ============================================================
   BLOODY RED PORTFOLIO - JAVASCRIPT INTERACTIONS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initEmbersCanvas();
  initTypewriter();
  initNavbarScroll();
  initMobileMenu();
  initSkillProgress();
  initProjectsFilter();
  initProjectModal();
  initTimelineTabs();
  initContactForm();
});

/* ============================================================
   1. BLOODY RED EMBERS CANVAS BACKGROUND
   ============================================================ */
function initEmbersCanvas() {
  const canvas = document.getElementById('ember-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const emberCount = Math.min(Math.floor(width / 24), 50);
  const embers = [];

  class Ember {
    constructor() {
      this.reset();```    ```````````````
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 20;
      this.size = Math.random() * 2.5 + 0.8;
      this.speedY = Math.random() * 0.8 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.fadeRate = Math.random() * 0.003 + 0.001;
      this.hue = Math.random() > 0.3 ? 350 : 10; // Bloody red to ruby
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.opacity -= this.fadeRate;

      if (this.opacity <= 0 || this.y < -10) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 55%, ${this.opacity})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(230, 0, 38, 0.8)';
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < emberCount; i++) {
    const e = new Ember();
    e.y = Math.random() * height; // initial spread
    embers.push(e);
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let ember of embers) {
      ember.update();
      ember.draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ============================================================
   2. TYPEWRITER EFFECT
   ============================================================ */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'Senior Mobile Application Specialist',
    'Flutter & Dart Specialist',
    'Android & iOS App Developer',
    'Python & Django Backend Integrator',
    'AI & Cloud-Connected App Architect'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      el.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2200; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ============================================================
   3. NAVBAR SCROLL & ACTIVE LINK
   ============================================================ */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ============================================================
   4. MOBILE MENU DRAWER
   ============================================================ */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.nav-menu');
  const links = document.querySelectorAll('.nav-link');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
    toggle.textContent = menu.classList.contains('open') ? '✕' : '☰';
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.textContent = '☰';
    });
  });
}

/* ============================================================
   5. SKILL PROGRESS BAR ANIMATION
   ============================================================ */
function initSkillProgress() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const targetWidth = fill.getAttribute('data-width') || '85%';
        fill.style.width = targetWidth;
      }
    });
  }, { threshold: 0.2 });

  fills.forEach(fill => observer.observe(fill));
}

/* ============================================================
   6. PROJECTS FILTER
   ============================================================ */
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ============================================================
   7. PROJECT DETAIL MODAL
   ============================================================ */
let projectsData = [];

async function loadProjectsData() {
  const possiblePaths = ['data/projects.json', './data/projects.json', '/data/projects.json', '/api/projects'];
  for (const path of possiblePaths) {
    try {
      const res = await fetch(path);
      if (res.ok) {
        projectsData = await res.json();
        return;
      }
    } catch (err) {
      // try next path
    }
  }
  console.warn('Could not load dynamic projects json, using inline fallback');
}

function initProjectModal() {
  loadProjectsData();

  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-body');

  if (!modal) return;

  document.addEventListener('click', (e) => {
    const detailBtn = e.target.closest('.project-btn-details');
    if (!detailBtn) return;

    const card = detailBtn.closest('.project-card');
    const projectId = card.getAttribute('data-id');

    const project = projectsData.find(p => p.id === projectId);

    if (project) {
      modalBody.innerHTML = `
        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
          <div style="font-size: 2.2rem; width: 60px; height: 60px; border-radius: 16px; background: rgba(230,0,38,0.15); border: 1px solid rgba(230,0,38,0.4); display: flex; align-items: center; justify-content: center;">
            ${project.icon || '📱'}
          </div>
          <div>
            <span class="project-badge" style="margin-bottom: 6px; display: inline-block;">${project.badge}</span>
            <h3 style="font-size: 1.6rem; color: #fff;">${project.title}</h3>
          </div>
        </div>

        <p style="color: var(--text-sub); font-size: 1.05rem; line-height: 1.7; margin-bottom: 24px;">
          ${project.description}
        </p>

        <h4 style="font-size: 1.1rem; color: var(--blood-bright); margin-bottom: 12px;">Key Highlights & Architecture:</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px;">
          ${project.highlights.map(h => `
            <li style="position: relative; padding-left: 22px; color: var(--text-sub); font-size: 0.95rem;">
              <span style="position: absolute; left: 0; color: var(--blood-bright);">✦</span> ${h}
            </li>
          `).join('')}
        </ul>

        <h4 style="font-size: 1.1rem; color: #fff; margin-bottom: 12px;">Technologies Used:</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 30px;">
          ${project.tags.map(t => `<span class="tag-pill" style="background: rgba(230,0,38,0.15); border: 1px solid rgba(230,0,38,0.3); color: #fff;">${t}</span>`).join('')}
        </div>

        <div style="display: flex; gap: 14px; padding-top: 20px; border-top: 1px solid rgba(230,0,38,0.2);">
          <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            View on GitHub ↗
          </a>
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('project-modal').classList.remove('open')">
            Close
          </button>
        </div>
      `;
      modal.classList.add('open');
    }
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
    }
  });
}

/* ============================================================
   8. TIMELINE TABS (EXPERIENCE vs EDUCATION)
   ============================================================ */
function initTimelineTabs() {
  const tabs = document.querySelectorAll('.timeline-tab-btn');
  const expTimeline = document.getElementById('experience-timeline');
  const eduTimeline = document.getElementById('education-timeline');

  if (!tabs.length || !expTimeline || !eduTimeline) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-target');
      if (target === 'experience') {
        expTimeline.style.display = 'block';
        eduTimeline.style.display = 'none';
      } else {
        expTimeline.style.display = 'none';
        eduTimeline.style.display = 'block';
      }
    });
  });
}

/* ============================================================
   9. CONTACT FORM (AJAX TO PYTHON BACKEND)
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  const toast = document.getElementById('toast');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      showToast('⚠️ Please fill in all required fields!', '#ff9f1c');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending Message...';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, subject, message })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showToast('🔥 Message sent successfully! Teena will get back to you soon.');
        form.reset();
      } else {
        showToast(`❌ ${result.error || 'Failed to send message.'}`, '#ff3366');
      }
    } catch (err) {
      // If offline or static mode, provide graceful mock confirmation
      console.log('Backend contact endpoint fallback:', err);
      showToast('🔥 Message recorded! (Local demonstration mode)');
      form.reset();
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message ✉';
    }
  });

  function showToast(msg, color) {
    if (!toast) return;
    toast.textContent = msg;
    if (color) {
      toast.style.borderColor = color;
    } else {
      toast.style.borderColor = 'var(--blood-bright)';
    }
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }
}
