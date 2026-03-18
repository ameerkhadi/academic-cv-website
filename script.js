// =============================================
//  DR. AMEER KADHIM HADI — ACADEMIC WEBSITE
//  script.js
// =============================================

document.addEventListener('DOMContentLoaded', () => {

    // ── DATE ──
    const lu = document.getElementById('last-updated');
    if (lu) lu.textContent = new Date().toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
    const fy = document.getElementById('footer-year');
    if (fy) fy.textContent = new Date().getFullYear();

    // ── NAVBAR SCROLL ──
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.style.boxShadow = window.scrollY > 20
            ? '0 4px 16px rgba(0,0,0,0.5)'
            : '0 2px 8px rgba(0,0,0,0.3)';
    }, { passive: true });

    // ── HAMBURGER ──
    const ham = document.getElementById('hamburger');
    const mob = document.getElementById('mobileMenu');
    if (ham) {
        ham.addEventListener('click', () => {
            mob.classList.toggle('open');
            const sp = ham.querySelectorAll('span');
            if (mob.classList.contains('open')) {
                sp[0].style.transform = 'rotate(45deg) translate(5px,5px)';
                sp[1].style.opacity = '0';
                sp[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
            } else {
                sp.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
            }
        });
        mob.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                mob.classList.remove('open');
                ham.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
            });
        });
    }

    // ── INTERSECTION OBSERVER ──
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    const observe = () => document.querySelectorAll('.fade-in, .fade-in-l').forEach(el => obs.observe(el));

    // ── LOAD ALL SECTIONS ──
    loadAbout();
    loadEducation();
    loadPublications();
    loadProjects();
    loadCourses();
    loadCertifications();
    loadAwards();
    loadGallery();
    loadContact();

    setTimeout(observe, 80);
    setupPublicationControls();
});

// ─────────────────────────────────────────────
//  SECTION LOADERS
// ─────────────────────────────────────────────

function loadAbout() {
    const p = academicData.personal;

    const bioEl = document.getElementById('about-bio');
    if (bioEl) bioEl.textContent = p.bio;

    // Quick links
    const linksEl = document.getElementById('about-links');
    if (linksEl) {
        const links = [
            { icon: '✉️', label: p.email, href: `mailto:${p.email}` },
            { icon: '📞', label: p.phone, href: `tel:${p.phone}` },
            { icon: '🔗', label: 'LinkedIn', href: p.linkedin },
        ];
        linksEl.innerHTML = links.map(l =>
            `<a href="${l.href}" class="about-link" target="_blank">${l.icon} ${l.label}</a>`
        ).join('');
    }

    renderChips('skills-technical', academicData.skills.technical);
    renderChips('skills-research',  academicData.skills.research);
    renderChips('skills-teaching',  academicData.skills.teaching);
}

function renderChips(id, arr) {
    const el = document.getElementById(id);
    if (!el || !arr) return;
    el.innerHTML = arr.map(s => `<span class="chip">${s}</span>`).join('');
}

function loadEducation() {
    const el = document.getElementById('education-list');
    if (!el || !academicData.education) return;
    el.innerHTML = academicData.education.map(e => `
        <div class="edu-card fade-in">
            <div class="edu-year">📅 ${e.year}</div>
            <div class="edu-degree">${e.degree}</div>
            <div class="edu-inst">🏛 ${e.institution}</div>
            ${e.dissertation ? `<div class="edu-note">📝 ${e.dissertation}</div>` : ''}
            ${e.specialization ? `<div class="edu-note">🎯 Specialization: ${e.specialization}</div>` : ''}
        </div>
    `).join('');
}

let pubData = [];

function loadPublications() {
    const el = document.getElementById('publications-list');
    if (!el || !academicData.publications) return;

    pubData = [...academicData.publications].sort((a, b) => b.year - a.year);

    // Total citations counter
    const total = pubData.reduce((sum, p) => sum + (p.citations || 0), 0);
    const tcEl = document.getElementById('total-cit');
    if (tcEl) tcEl.textContent = total;

    renderPublications(pubData);
}

function renderPublications(list) {
    const el = document.getElementById('publications-list');
    if (!el) return;
    el.innerHTML = list.map((pub, i) => `
        <div class="pub-item fade-in" data-type="${pub.type}">
            <div class="pub-left-bar ${pub.type}"></div>
            <div class="pub-body">
                <div class="pub-top-row">
                    <span class="pub-type-pill ${pub.type}">${pub.type === 'journal' ? '📘 Journal' : '🎤 Conference'}</span>
                    <span class="pub-year-pill">📅 ${pub.year}</span>
                    ${pub.citations > 0
                        ? `<span class="pub-cite-pill">🔖 ${pub.citations} citation${pub.citations > 1 ? 's' : ''}</span>`
                        : ''}
                    <span class="pub-num">#${String(i + 1).padStart(2, '0')}</span>
                </div>
                <div class="pub-title">${pub.title}</div>
                <div class="pub-authors">${pub.authors}</div>
                <div class="pub-venue">${pub.venue}</div>
            </div>
        </div>
    `).join('');

    setTimeout(() => {
        document.querySelectorAll('#publications-list .fade-in').forEach(el => {
            const obs = new IntersectionObserver(entries => {
                entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
            }, { threshold: 0.05 });
            obs.observe(el);
        });
    }, 50);
}

function setupPublicationControls() {
    let currentFilter = 'all';
    let currentSort = 'year';

    const pills = document.querySelectorAll('.pill');
    const sortBtns = document.querySelectorAll('.sort-btn');

    pills.forEach(btn => {
        btn.addEventListener('click', () => {
            pills.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            applyFilterSort();
        });
    });

    sortBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sortBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSort = btn.getAttribute('data-sort');
            applyFilterSort();
        });
    });

    function applyFilterSort() {
        let list = [...academicData.publications];

        // Sort
        if (currentSort === 'year') {
            list.sort((a, b) => b.year - a.year);
        } else {
            list.sort((a, b) => (b.citations || 0) - (a.citations || 0));
        }

        // Filter
        if (currentFilter !== 'all') {
            list = list.filter(p => p.type === currentFilter);
        }

        renderPublications(list);

        // Apply hidden class
        if (currentFilter !== 'all') {
            document.querySelectorAll('.pub-item').forEach(item => {
                if (item.getAttribute('data-type') !== currentFilter) {
                    item.classList.add('hidden');
                }
            });
        }
    }
}

function loadProjects() {
    const el = document.getElementById('projects-list');
    if (!el || !academicData.projects) return;
    el.innerHTML = academicData.projects.map(p => `
        <div class="proj-card fade-in">
            <div class="proj-card-hdr">
                <span style="font-size:0.82rem;font-weight:600;color:var(--text)">🔬 Research Project</span>
                <span class="proj-status ${p.status.toLowerCase()}">${p.status}</span>
            </div>
            <div class="proj-card-body">
                <div class="proj-title">${p.title}</div>
                <div class="proj-desc">${p.description}</div>
                <div class="proj-meta">
                    ⏱️ Duration: <span>${p.duration}</span><br>
                    ${p.funding ? `💰 Funding: <span>${p.funding}</span>` : ''}
                </div>
                <div class="proj-tech-wrap">
                    ${p.technologies.map(t => `<span class="proj-tech">${t}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function loadCourses() {
    const el = document.getElementById('courses-list');
    if (!el || !academicData.courses) return;
    el.innerHTML = academicData.courses.map(c => `
        <div class="course-card fade-in">
            <div class="course-card-top">
                <span class="course-level-tag">${c.level}</span>
                <span style="margin-left:auto;font-family:var(--mono);font-size:0.65rem;color:rgba(255,255,255,0.4)">${c.semester}</span>
            </div>
            <div class="course-body">
                <div class="course-title">${c.title}</div>
                <div class="course-desc">${c.description}</div>
            </div>
        </div>
    `).join('');
}

function loadCertifications() {
    const el = document.getElementById('certs-list');
    if (!el || !academicData.certifications) return;
    const icons = ['☁️', '🎓', '💻', '🌐'];
    el.innerHTML = academicData.certifications.map((c, i) => `
        <div class="cert-card fade-in">
            <div class="cert-icon-box">${icons[i % icons.length]}</div>
            <div>
                <div class="cert-title">${c.title}</div>
                <div class="cert-issuer">${c.issuer}</div>
                <div class="cert-year">📅 ${c.year}</div>
            </div>
        </div>
    `).join('');
}

function loadAwards() {
    const el = document.getElementById('awards-list');
    if (!el || !academicData.awards) return;
    const icons = ['🏆', '🥇', '🎖️', '🌟'];
    el.innerHTML = academicData.awards.map((a, i) => `
        <div class="award-card fade-in">
            <div class="award-icon">${icons[i % icons.length]}</div>
            <div class="award-title">${a.title}</div>
            <div class="award-meta">
                ${a.issuer ? `<span>${a.issuer}</span> · ` : ''}<span>${a.year}</span>
            </div>
        </div>
    `).join('');
}

function loadGallery() {
    const el = document.getElementById('gallery-grid');
    if (!el || !academicData.gallery) return;
    el.innerHTML = academicData.gallery.map(item => `
        <div class="gal-item fade-in">
            <img src="${item.src}" alt="${item.alt}"
                onerror="this.parentElement.innerHTML='<div class=\\'gal-placeholder\\'>🖼️<br><span>${item.caption}</span></div>'">
            <div class="gal-caption">${item.caption}</div>
        </div>
    `).join('');
}

function loadContact() {
    const p = academicData.personal;

    // Contact items
    const ciEl = document.getElementById('contact-items');
    if (ciEl) {
        const items = [
            { icon: '✉️', label: 'Email', value: `<a href="mailto:${p.email}">${p.email}</a>` },
            { icon: '📞', label: 'Phone', value: p.phone },
            { icon: '📍', label: 'Location', value: 'Babylon, Iraq' },
        ];
        ciEl.innerHTML = items.map(i => `
            <div class="contact-item">
                <div class="c-icon">${i.icon}</div>
                <div><div class="c-label">${i.label}</div><div class="c-value">${i.value}</div></div>
            </div>
        `).join('');
    }

    // Name/title
    const cn = document.getElementById('c-name');
    const ct = document.getElementById('c-title');
    if (cn) cn.textContent = p.name;
    if (ct) ct.textContent = p.title + ' · ' + p.subtitle;

    // Profiles
    const prEl = document.getElementById('contact-profiles');
    if (prEl) {
        const profiles = [
            { icon: '🔗', label: 'LinkedIn', href: p.linkedin },
            { icon: '🎓', label: 'Google Scholar', href: p.googleScholar },
            { icon: '🔬', label: 'ResearchGate', href: p.researchGate },
            { icon: '🪪', label: 'ORCID', href: p.orcid },
        ];
        prEl.innerHTML = profiles.map(pr => `
            <a href="${pr.href}" target="_blank" class="profile-link">${pr.icon} ${pr.label} ↗</a>
        `).join('');
    }
}
