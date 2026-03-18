// =============================================
//  DR. AMEER KADHIM HADI — ACADEMIC WEBSITE
//  script.js — All dynamic functionality
// =============================================

document.addEventListener('DOMContentLoaded', () => {

    // ── PRELOADER ──
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => preloader.classList.add('hidden'), 800);
    });

    // ── NAVBAR SCROLL ──
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // ── MOBILE MENU ──
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    navToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        const spans = navToggle.querySelectorAll('span');
        if (mobileMenu.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        }
    });
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        });
    });

    // ── INTERSECTION OBSERVER ──
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    const observeAll = (selector) => {
        document.querySelectorAll(selector).forEach(el => revealObserver.observe(el));
    };

    // ── COUNTER ANIMATION ──
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 1800;
        const start = performance.now();
        const update = (time) => {
            const elapsed = time - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target;
        };
        requestAnimationFrame(update);
    }

    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.stat-num').forEach(animateCounter);
                heroObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) heroObserver.observe(heroStats);

    // ── LOAD ALL CONTENT ──
    loadAbout();
    loadEducation();
    loadPublications();
    loadProjects();
    loadCourses();
    loadCertifications();
    loadAwards();
    loadGallery();
    loadContact();
    loadFooter();

    // Observe reveal elements after content loads
    setTimeout(() => {
        observeAll('.reveal-up, .reveal-left, .reveal-right');
        observeAll('.timeline-item, .pub-item, .project-card, .course-card, .cert-card, .award-card, .gallery-item');
    }, 100);

    // ── PUBLICATION FILTER ──
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            document.querySelectorAll('.pub-item').forEach(item => {
                if (filter === 'all' || item.getAttribute('data-type') === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

});

// =============================================
//  SECTION LOADERS
// =============================================

function loadAbout() {
    const p = academicData.personal;

    // Bio
    const bioEl = document.getElementById('about-bio-text');
    if (bioEl) bioEl.textContent = p.bio;

    // Email link
    const emailLink = document.getElementById('about-email-link');
    const emailText = document.getElementById('about-email-text');
    if (emailLink && p.email) {
        emailLink.href = `mailto:${p.email}`;
        emailText.textContent = p.email;
    }

    // LinkedIn
    const linkedinEl = document.getElementById('about-linkedin');
    if (linkedinEl && p.linkedin) linkedinEl.href = p.linkedin;

    // Skills
    renderSkills('skills-technical', academicData.skills.technical);
    renderSkills('skills-research', academicData.skills.research);
    renderSkills('skills-teaching', academicData.skills.teaching);
}

function renderSkills(containerId, skills) {
    const container = document.getElementById(containerId);
    if (!container || !skills) return;
    container.innerHTML = skills.map(s =>
        `<span class="skill-chip">${s}</span>`
    ).join('');
}

function loadEducation() {
    const container = document.getElementById('education-timeline');
    if (!container || !academicData.education) return;

    container.innerHTML = academicData.education.map(edu => `
        <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-year">${edu.year}</div>
            <div class="timeline-degree">${edu.degree}</div>
            <div class="timeline-institution">${edu.institution}</div>
            ${edu.dissertation ? `<div class="timeline-note">Dissertation: ${edu.dissertation}</div>` : ''}
            ${edu.specialization ? `<div class="timeline-note">Specialization: ${edu.specialization}</div>` : ''}
        </div>
    `).join('');
}

function loadPublications() {
    const container = document.getElementById('publications-list');
    if (!container || !academicData.publications) return;

    container.innerHTML = academicData.publications.map((pub, i) => `
        <div class="pub-item" data-type="${pub.type}">
            <div class="pub-number">${String(i + 1).padStart(2, '0')}</div>
            <div class="pub-content">
                <span class="pub-type-badge ${pub.type}">${pub.type}</span>
                <div class="pub-title">${pub.title}</div>
                <div class="pub-authors">${pub.authors}</div>
                <div class="pub-venue">${pub.venue}</div>
                ${pub.link && pub.link !== '#' ? `
                    <a href="${pub.link}" target="_blank" class="pub-link">
                        View Publication →
                    </a>` : ''}
            </div>
        </div>
    `).join('');
}

function loadProjects() {
    const container = document.getElementById('projects-list');
    if (!container || !academicData.projects) return;

    container.innerHTML = academicData.projects.map(proj => `
        <div class="project-card">
            <div class="project-status ${proj.status.toLowerCase()}">${proj.status}</div>
            <div class="project-title">${proj.title}</div>
            <div class="project-description">${proj.description}</div>
            <div class="project-meta">
                <div>Duration: <span>${proj.duration}</span></div>
                ${proj.funding ? `<div>Funding: <span>${proj.funding}</span></div>` : ''}
            </div>
            <div class="project-tech">
                ${proj.technologies.map(t => `<span class="project-tech-tag">${t}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

function loadCourses() {
    const container = document.getElementById('courses-list');
    if (!container || !academicData.courses) return;

    container.innerHTML = academicData.courses.map(course => `
        <div class="course-card">
            <div class="course-level">${course.level} · ${course.semester}</div>
            <div class="course-title">${course.title}</div>
            <div class="course-desc">${course.description}</div>
        </div>
    `).join('');
}

function loadCertifications() {
    const container = document.getElementById('certs-list');
    if (!container || !academicData.certifications) return;

    container.innerHTML = academicData.certifications.map(cert => `
        <div class="cert-card">
            <div class="cert-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                </svg>
            </div>
            <div>
                <div class="cert-title">${cert.title}</div>
                <div class="cert-issuer">${cert.issuer}</div>
                <div class="cert-year">${cert.year}</div>
            </div>
        </div>
    `).join('');
}

function loadAwards() {
    const container = document.getElementById('awards-list');
    if (!container || !academicData.awards) return;

    const icons = ['🏆', '🥇', '🎖️', '🌟'];
    container.innerHTML = academicData.awards.map((award, i) => `
        <div class="award-card">
            <div class="award-icon">${icons[i % icons.length]}</div>
            <div class="award-title">${award.title}</div>
            <div class="award-meta">
                ${award.issuer ? `<span>${award.issuer}</span> · ` : ''}<span>${award.year}</span>
            </div>
        </div>
    `).join('');
}

function loadGallery() {
    const container = document.getElementById('gallery-grid');
    if (!container || !academicData.gallery) return;

    container.innerHTML = academicData.gallery.map(item => `
        <div class="gallery-item">
            <img src="${item.src}" alt="${item.alt}"
                 onerror="this.parentElement.innerHTML='<div class=\'gallery-placeholder\'><svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'1\'><rect x=\'3\' y=\'3\' width=\'18\' height=\'18\' rx=\'2\'/><circle cx=\'8.5\' cy=\'8.5\' r=\'1.5\'/><path d=\'M21 15l-5-5L5 21\'/></svg><span>${item.caption}</span></div>'">
            <div class="gallery-caption">${item.caption}</div>
        </div>
    `).join('');
}

function loadContact() {
    const p = academicData.personal;

    // Contact items
    const contactItems = document.getElementById('contact-items');
    if (contactItems) {
        const items = [
            { icon: emailIcon(), label: 'Email', value: `<a href="mailto:${p.email}">${p.email}</a>` },
            { icon: phoneIcon(), label: 'Phone', value: p.phone },
            { icon: linkedinIcon(), label: 'LinkedIn', value: `<a href="${p.linkedin}" target="_blank">linkedin.com/in/ameer-hadi</a>` },
            { icon: scholarIcon(), label: 'Google Scholar', value: `<a href="${p.googleScholar}" target="_blank">Scholar Profile</a>` },
            { icon: researchgateIcon(), label: 'ResearchGate', value: `<a href="${p.researchGate}" target="_blank">ResearchGate Profile</a>` },
        ];
        contactItems.innerHTML = items.map(item => `
            <div class="contact-item">
                <div class="contact-item-icon">${item.icon}</div>
                <div>
                    <div class="contact-item-label">${item.label}</div>
                    <div class="contact-item-value">${item.value}</div>
                </div>
            </div>
        `).join('');
    }

    // Contact card
    const cardName = document.getElementById('card-name');
    const cardTitle = document.getElementById('card-title');
    const cardLinks = document.getElementById('card-links');
    if (cardName) cardName.textContent = p.name;
    if (cardTitle) cardTitle.textContent = p.title + ' · ' + p.subtitle;
    if (cardLinks) {
        cardLinks.innerHTML = `
            <a href="mailto:${p.email}" class="card-link">
                ${emailIcon()} ${p.email}
            </a>
            <a href="tel:${p.phone}" class="card-link">
                ${phoneIcon()} ${p.phone}
            </a>
            <a href="${p.linkedin}" target="_blank" class="card-link">
                ${linkedinIcon()} LinkedIn
            </a>
        `;
    }
}

function loadFooter() {
    const p = academicData.personal;
    const footerName = document.getElementById('footer-name');
    const footerYear = document.getElementById('footer-year');
    if (footerName) footerName.textContent = p.name;
    if (footerYear) footerYear.textContent = new Date().getFullYear();

    // Also update page title & hero header
    document.title = p.name + ' — Academic Portfolio';
}

// ── SVG ICON HELPERS ──
function emailIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`;
}
function phoneIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>`;
}
function linkedinIcon() {
    return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>`;
}
function scholarIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>`;
}
function researchgateIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`;
}
