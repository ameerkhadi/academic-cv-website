// =============================================
//  د. أمير كاظم هادي — script_ar.js
// =============================================

document.addEventListener('DOMContentLoaded', () => {

    // التواريخ بالعربية
    const lu = document.getElementById('last-updated');
    if (lu) {
        lu.textContent = new Intl.DateTimeFormat('ar-IQ-u-nu-latn', {
            day: 'numeric', month: 'long', year: 'numeric'
        }).format(new Date());
    }
    const fy = document.getElementById('footer-year');
    if (fy) fy.textContent = new Date().getFullYear();

    // navbar scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    // hamburger
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
        mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            mob.classList.remove('open');
            ham.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        }));
    }

    // intersection observer
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });

    loadHero();
    loadAbout();
    loadEducation();
    loadPublications();
    loadProjects();
    loadCourses();
    loadMedia();
    loadCertifications();
    loadAwards();
    loadGallery();
    loadContact();
    setupPubControls();

    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
    }, 80);
});

// ── Hero ──
function loadHero() {
    const p = academicData.personal;

    const nameEl = document.getElementById('hero-name-text');
    if (nameEl) nameEl.textContent = p.name;

    const avatarWrap = document.getElementById('hero-avatar-wrap');
    if (avatarWrap) {
        if (p.photo) {
            avatarWrap.innerHTML = `<img src="${p.photo}" alt="${p.name}" class="hero-avatar"
                onerror="this.outerHTML='<div class=hero-avatar-placeholder>👤</div>'">`;
        } else {
            avatarWrap.innerHTML = `<div class="hero-avatar-placeholder">👤</div>`;
        }
    }

    const total = (academicData.publications || []).reduce((s, p) => s + (p.citations || 0), 0);
    const tcEl = document.getElementById('total-cit');
    if (tcEl) tcEl.textContent = total;
}

// ── About ──
function loadAbout() {
    const p = academicData.personal;
    const bioEl = document.getElementById('about-bio');
    if (bioEl) bioEl.textContent = p.bio;

    const linksEl = document.getElementById('about-links');
    if (linksEl) {
        const items = [
            { icon:'✉️', label: p.email, href: `mailto:${p.email}` },
            { icon:'🔗', label: 'لينكدإن', href: p.linkedin },
        ];
        if (p.phone) {
            items.splice(1, 0, { icon:'📞', label: p.phone, href: `tel:${p.phone}` });
        }
        linksEl.innerHTML = items
            .map(l => `<a href="${l.href}" class="about-link" target="_blank">${l.icon} ${l.label}</a>`)
            .join('');
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

// ── Education ──
function loadEducation() {
    const el = document.getElementById('education-list');
    if (!el) return;
    el.innerHTML = (academicData.education || []).map(e => `
        <div class="edu-card fade-in">
            <div class="edu-year">📅 ${e.year}</div>
            <div class="edu-degree">${e.degree}</div>
            <div class="edu-inst">🏛 ${e.institution}</div>
            ${e.dissertation ? `<div class="edu-note">📝 ${e.dissertation}</div>` : ''}
            ${e.specialization ? `<div class="edu-note">🎯 ${e.specialization}</div>` : ''}
        </div>`).join('');
}

// ── Publications ──
let pubSort = 'year';
let pubFilter = 'all';

function loadPublications() { renderPublications(); }

function renderPublications() {
    const el = document.getElementById('publications-list');
    if (!el) return;
    let list = [...(academicData.publications || [])];

    list.sort((a, b) => pubSort === 'year'
        ? b.year - a.year
        : (b.citations || 0) - (a.citations || 0));

    if (pubFilter !== 'all') list = list.filter(p => p.type === pubFilter);

    el.innerHTML = list.map((pub, i) => `
        <div class="pub-item fade-in" data-type="${pub.type}">
            <div class="pub-body">
                <div class="pub-top-row">
                    <span class="pub-type-pill ${pub.type}">${pub.type === 'journal' ? '📘 مجلة' : '🎤 مؤتمر'}</span>
                    <span class="pub-year-pill">📅 ${pub.year}</span>
                    ${pub.citations > 0 ? `<span class="pub-cite-pill">🔖 ${pub.citations} اقتباس</span>` : ''}
                    <span class="pub-num">#${String(i + 1).padStart(2,'0')}</span>
                </div>
                <div class="pub-title">${pub.title}</div>
                <div class="pub-authors">${pub.authors}</div>
                <div class="pub-venue">${pub.venue}</div>
            </div>
            <div class="pub-bar ${pub.type}"></div>
        </div>`).join('');

    setTimeout(() => {
        const o = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        }, { threshold: 0.05 });
        document.querySelectorAll('#publications-list .fade-in').forEach(el => o.observe(el));
    }, 50);
}

function setupPubControls() {
    document.querySelectorAll('.pill').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            pubFilter = btn.getAttribute('data-filter');
            renderPublications();
        });
    });
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            pubSort = btn.getAttribute('data-sort');
            renderPublications();
        });
    });
}

// ── Projects ──
function loadProjects() {
    const el = document.getElementById('projects-list');
    if (!el) return;
    el.innerHTML = (academicData.projects || []).map(p => `
        <div class="proj-card fade-in">
            <div class="proj-card-hdr">
                🔬 مشروع بحثي
                <span class="proj-status ${p.status}">${p.status}</span>
            </div>
            <div class="proj-card-body">
                <div class="proj-title">${p.title}</div>
                <div class="proj-desc">${p.description}</div>
                <div class="proj-meta">
                    ⏱️ المدة: <span>${p.duration}</span><br>
                    ${p.funding ? `💰 التمويل: <span>${p.funding}</span>` : ''}
                </div>
                <div class="proj-tech-wrap">
                    ${p.technologies.map(t => `<span class="proj-tech">${t}</span>`).join('')}
                </div>
            </div>
        </div>`).join('');
}

// ── Courses ──
function loadCourses() {
    const el = document.getElementById('courses-list');
    if (!el) return;
    el.innerHTML = (academicData.courses || []).map(c => `
        <div class="course-card fade-in">
            <div class="course-card-top">
                <span class="course-level-tag">${c.level}</span>
                <span style="font-family:var(--mono);font-size:.62rem;color:var(--text-dim)">${c.semester}</span>
            </div>
            <div class="course-body">
                <div class="course-title">${c.title}</div>
                <div class="course-desc">${c.description}</div>
            </div>
        </div>`).join('');
}

// ── Media ──
function loadMedia() {
    const el = document.getElementById('media-list');
    if (!el) return;

    if (!academicData.media || academicData.media.length === 0) {
        el.innerHTML = `
            <div class="panel" style="grid-column:1/-1;padding:2rem;text-align:center;color:var(--text-muted)">
                <div style="font-size:2rem;margin-bottom:.8rem">📢</div>
                <div style="font-size:.9rem;margin-bottom:.5rem;color:var(--text)">لا توجد منشورات إعلامية بعد</div>
                <div style="font-size:.8rem">أضف منشورات إلى مصفوفة <code style="background:var(--bg-card2);padding:.1rem .4rem;border-radius:3px;color:var(--orange)">media</code> في ملف <code style="background:var(--bg-card2);padding:.1rem .4rem;border-radius:3px;color:var(--orange)">data_ar.js</code></div>
            </div>`;
        return;
    }

    el.innerHTML = academicData.media.map(item => `
        <div class="media-card fade-in">
            <div class="media-img-wrap">
                ${item.image
                    ? `<img src="${item.image}" alt="${item.title}" onerror="this.parentElement.innerHTML='📢'">`
                    : '📢'}
                <span class="media-platform-badge ${item.platform.toLowerCase()}">${item.platform}</span>
            </div>
            <div class="media-card-body">
                <div class="media-source">🏛 ${item.source}</div>
                <div class="media-title">${item.title}</div>
                <div class="media-desc">${item.description}</div>
                ${item.link && item.link !== '#'
                    ? `<a href="${item.link}" target="_blank" class="media-link">عرض المنشور ←</a>`
                    : ''}
                <div class="media-date">📅 ${item.date}</div>
            </div>
        </div>`).join('');
}

// ── Certifications ──
function loadCertifications() {
    const el = document.getElementById('certs-list');
    if (!el) return;
    const icons = ['☁️','🎓','💻','🌐'];
    el.innerHTML = (academicData.certifications || []).map((c, i) => `
        <div class="cert-card fade-in">
            <div class="cert-icon-box">${icons[i % icons.length]}</div>
            <div>
                <div class="cert-title">${c.title}</div>
                <div class="cert-issuer">${c.issuer}</div>
                <div class="cert-year">📅 ${c.year}</div>
            </div>
        </div>`).join('');
}

// ── Awards ──
function loadAwards() {
    const el = document.getElementById('awards-list');
    if (!el) return;
    const icons = ['🏆','🥇','🎖️','🌟'];
    el.innerHTML = (academicData.awards || []).map((a, i) => `
        <div class="award-card fade-in">
            <div class="award-icon">${icons[i % icons.length]}</div>
            <div class="award-title">${a.title}</div>
            <div class="award-meta">${a.issuer ? `<span>${a.issuer}</span> · ` : ''}<span>${a.year}</span></div>
        </div>`).join('');
}

// ── Gallery ──
function loadGallery() {
    const el = document.getElementById('gallery-grid');
    if (!el) return;
    el.innerHTML = (academicData.gallery || []).map(item => `
        <div class="gal-item fade-in">
            <img src="${item.src}" alt="${item.alt}"
                onerror="this.parentElement.innerHTML='<div class=gal-placeholder>🖼️<br><span>${item.caption}</span></div>'">
            <div class="gal-caption">${item.caption}</div>
        </div>`).join('');
}

// ── Contact ──
function loadContact() {
    const p = academicData.personal;
    const ciEl = document.getElementById('contact-items');
    if (ciEl) {
        const items = [
            { icon:'✉️', label:'البريد الإلكتروني', value:`<a href="mailto:${p.email}">${p.email}</a>` },
            { icon:'📍', label:'الموقع', value:'بابل، العراق' },
        ];
        if (p.phone) {
            items.splice(1, 0, { icon:'📞', label:'الهاتف', value: p.phone });
        }
        ciEl.innerHTML = items.map(i => `
            <div class="contact-item">
                <div class="c-icon">${i.icon}</div>
                <div><div class="c-label">${i.label}</div><div class="c-value">${i.value}</div></div>
            </div>`).join('');
    }
    const cn = document.getElementById('c-name'); if (cn) cn.textContent = p.name;
    const ct = document.getElementById('c-title'); if (ct) ct.textContent = p.title + ' · ' + p.subtitle;
    const prEl = document.getElementById('contact-profiles');
    if (prEl) {
        prEl.innerHTML = [
            { icon:'🔗', label:'لينكدإن',        href: p.linkedin },
            { icon:'🎓', label:'جوجل سكولار',    href: p.googleScholar },
            { icon:'🔬', label:'ريسيرش جيت',      href: p.researchGate },
            { icon:'🪪', label:'ORCID',            href: p.orcid },
        ].map(pr => `<a href="${pr.href}" target="_blank" class="profile-link">${pr.icon} ${pr.label} ↗</a>`).join('');
    }
}
