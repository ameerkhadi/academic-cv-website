// =============================================
//  DR. AMEER KADHIM HADI — script.js
//  Bilingual (English / Arabic) version
// =============================================

// ── Static UI text dictionary (non-data-driven strings) ──
const uiText = {
    en: {
        crumbUni: "University of Babylon",
        crumbFac: "Faculty of IT",
        updatedLabel: "Updated:",
        navBrand: "Dr. Ameer Hadi",
        navAbout: "About",
        navEducation: "Education",
        navPublications: "Publications",
        navProjects: "Projects",
        navCourses: "Teaching",
        navMedia: "Media",
        navAwards: "Awards",
        navContact: "Contact",

        heroBadge: "Assistant Professor · University of Babylon",
        heroSub: "Faculty of Information Technology · Information Network Dept.",
        tag1: "☁️ Cloud Computing",
        tag2: "🤖 Artificial Intelligence",
        tag3: "📡 IoT",
        tag4: "🔗 Blockchain",
        tag5: "🔐 Network Security",
        statYears: "⏱️ Years Exp.",
        statPapers: "📄 Papers",
        statCitations: "🔖 Citations",
        statAwards: "🏆 Awards",
        btnViewPubs: "📄 View Publications",
        btnGetTouch: "✉️ Get in Touch",

        cardTitle: "🎯 PROFILE OVERVIEW",
        chk1: "✓ &nbsp;AI & Deep Learning Research",
        chk2: "✓ &nbsp;Blockchain & Network Optimization",
        chk3: "✓ &nbsp;IoT Smart Systems & Applications",
        chk4: "✓ &nbsp;Cloud Computing (AWS Certified)",
        chk5: "✓ &nbsp;15+ Years Teaching CS & Math",
        chk6: "✓ &nbsp;Fulbright Scholar — U.S. Dept. of State",
        svc1: "🖥 IEEE Access",
        svc2: "☁️ AWS Academy",
        svc3: "🎓 PhD CS",
        svc4: "🌿 Fulbright",
        infoBox: "ℹ️ &nbsp;Open to research collaborations, student supervision, and academic partnerships.",

        secEyeAbout: "About", secH2About: "Professional Summary",
        panelBio: "📋 &nbsp;Bio",
        panelTechnical: "🛠 &nbsp;Technical Skills",
        panelResearch: "🔬 &nbsp;Research Skills",
        panelTeaching: "📚 &nbsp;Teaching Skills",

        secEyeEdu: "Education", secH2Edu: "Academic Background",

        secEyePub: "Research", secH2Pub: "Publications",
        filterAll: "All",
        filterJournal: "📘 Journals",
        filterConference: "🎤 Conferences",
        sortLabel: "Sort:",
        sortYear: "Year ↓",
        sortCitations: "Citations ↓",

        secEyeProj: "Projects", secH2Proj: "Research Projects",
        secEyeCourses: "Teaching", secH2Courses: "Courses Taught",
        secEyeMedia: "Media", secH2Media: "News & Media",
        secEyeCerts: "Credentials", secH2Certs: "Certifications",
        secEyeAwards: "Recognition", secH2Awards: "Awards & Honors",
        secEyeGallery: "Gallery", secH2Gallery: "Photo Gallery",
        secEyeContact: "Contact", secH2Contact: "Get in Touch",

        panelContactInfo: "📬 &nbsp;Contact Information",
        panelAffiliation: "🏛 &nbsp;Affiliation",
        affilUni: "Faculty of Information Technology<br>University of Babylon, Iraq",
        panelProfiles: "🔗 &nbsp;Online Profiles",

        footerRights: "All rights reserved.",
        footerTop: "↑ Top",

        // Dynamic render strings
        journalLabel: "📘 Journal",
        conferenceLabel: "🎤 Conference",
        citationWord: "citation",
        citationsWord: "citations",
        researchProjectHdr: "🔬 Research Project",
        durationLabel: "⏱️ Duration:",
        fundingLabel: "💰 Funding:",
        noMediaTitle: "No media posts yet",
        noMediaDesc: "Add posts to the",
        noMediaDesc2: "array in",
        viewPost: "View Post →",
        labelEmail: "Email",
        labelPhone: "Phone",
        labelLocation: "Location",
        locationValue: "Babylon, Iraq",
        linkedinLabel: "LinkedIn",
        scholarLabel: "Google Scholar",
        researchGateLabel: "ResearchGate",
        orcidLabel: "ORCID",
        langToggle: "🌐 عربي",
        dateLocale: "en-GB"
    },
    ar: {
        crumbUni: "جامعة بابل",
        crumbFac: "كلية تكنولوجيا المعلومات",
        updatedLabel: "آخر تحديث:",
        navBrand: "د. أمير هادي",
        navAbout: "نبذة",
        navEducation: "التعليم",
        navPublications: "المنشورات",
        navProjects: "المشاريع",
        navCourses: "التدريس",
        navMedia: "الإعلام",
        navAwards: "الجوائز",
        navContact: "التواصل",

        heroBadge: "أستاذ مساعد · جامعة بابل",
        heroSub: "كلية تكنولوجيا المعلومات · قسم شبكات المعلومات",
        tag1: "☁️ الحوسبة السحابية",
        tag2: "🤖 الذكاء الاصطناعي",
        tag3: "📡 إنترنت الأشياء",
        tag4: "🔗 البلوكتشين",
        tag5: "🔐 أمن الشبكات",
        statYears: "⏱️ سنوات الخبرة",
        statPapers: "📄 الأبحاث",
        statCitations: "🔖 الاستشهادات",
        statAwards: "🏆 الجوائز",
        btnViewPubs: "📄 عرض المنشورات",
        btnGetTouch: "✉️ تواصل معي",

        cardTitle: "🎯 نظرة عامة على الملف",
        chk1: "✓ &nbsp;بحوث الذكاء الاصطناعي والتعلم العميق",
        chk2: "✓ &nbsp;البلوكتشين وتحسين الشبكات",
        chk3: "✓ &nbsp;أنظمة وتطبيقات إنترنت الأشياء الذكية",
        chk4: "✓ &nbsp;الحوسبة السحابية (معتمد AWS)",
        chk5: "✓ &nbsp;أكثر من 15 عامًا في تدريس الحاسوب والرياضيات",
        chk6: "✓ &nbsp;باحث فولبرايت — وزارة الخارجية الأمريكية",
        svc1: "🖥 IEEE Access",
        svc2: "☁️ AWS Academy",
        svc3: "🎓 دكتوراه حاسوب",
        svc4: "🌿 فولبرايت",
        infoBox: "ℹ️ &nbsp;مرحّب بالتعاون البحثي، والإشراف على الطلبة، والشراكات الأكاديمية.",

        secEyeAbout: "نبذة", secH2About: "الملخص المهني",
        panelBio: "📋 &nbsp;السيرة الذاتية",
        panelTechnical: "🛠 &nbsp;المهارات التقنية",
        panelResearch: "🔬 &nbsp;المهارات البحثية",
        panelTeaching: "📚 &nbsp;المهارات التدريسية",

        secEyeEdu: "التعليم", secH2Edu: "المؤهلات العلمية",

        secEyePub: "البحث العلمي", secH2Pub: "المنشورات",
        filterAll: "الكل",
        filterJournal: "📘 المجلات",
        filterConference: "🎤 المؤتمرات",
        sortLabel: "ترتيب:",
        sortYear: "السنة ↓",
        sortCitations: "الاستشهادات ↓",

        secEyeProj: "المشاريع", secH2Proj: "مشاريع بحثية",
        secEyeCourses: "التدريس", secH2Courses: "المقررات التي أُدرّسها",
        secEyeMedia: "الإعلام", secH2Media: "الأخبار والإعلام",
        secEyeCerts: "الشهادات", secH2Certs: "الشهادات المهنية",
        secEyeAwards: "التقدير", secH2Awards: "الجوائز والتكريمات",
        secEyeGallery: "معرض الصور", secH2Gallery: "معرض الصور",
        secEyeContact: "التواصل", secH2Contact: "تواصل معي",

        panelContactInfo: "📬 &nbsp;معلومات التواصل",
        panelAffiliation: "🏛 &nbsp;الانتساب",
        affilUni: "كلية تكنولوجيا المعلومات<br>جامعة بابل، العراق",
        panelProfiles: "🔗 &nbsp;الحسابات العلمية",

        footerRights: "جميع الحقوق محفوظة.",
        footerTop: "↑ الأعلى",

        // Dynamic render strings
        journalLabel: "📘 مجلة",
        conferenceLabel: "🎤 مؤتمر",
        citationWord: "استشهاد",
        citationsWord: "استشهادات",
        researchProjectHdr: "🔬 مشروع بحثي",
        durationLabel: "⏱️ المدة:",
        fundingLabel: "💰 التمويل:",
        noMediaTitle: "لا توجد منشورات إعلامية حالياً",
        noMediaDesc: "أضف منشورات إلى مصفوفة",
        noMediaDesc2: "في ملف",
        viewPost: "عرض المنشور ←",
        labelEmail: "البريد الإلكتروني",
        labelPhone: "الهاتف",
        labelLocation: "الموقع",
        locationValue: "بابل، العراق",
        linkedinLabel: "لينكدإن",
        scholarLabel: "Google Scholar",
        researchGateLabel: "ResearchGate",
        orcidLabel: "ORCID",
        langToggle: "🌐 English",
        dateLocale: "ar-IQ"
    }
};

let currentLang = localStorage.getItem('site-lang') || 'en';
let pubSort = 'year';
let pubFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {

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

    // language toggle button
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            setLanguage(currentLang === 'en' ? 'ar' : 'en');
        });
    }

    setupPubControls();
    setLanguage(currentLang, true);

    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach(el => observeFade(el));
    }, 80);
});

let fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });

function observeFade(el) { fadeObserver.observe(el); }

// ── LANGUAGE SWITCHING ──
function setLanguage(lang, isInitial) {
    currentLang = lang;
    localStorage.setItem('site-lang', lang);

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('lang-ar', lang === 'ar');

    applyStaticText();

    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) langBtn.textContent = uiText[lang].langToggle;

    // dates
    const lu = document.getElementById('last-updated');
    if (lu) lu.textContent = new Date().toLocaleDateString(uiText[lang].dateLocale, { day: 'numeric', month: 'short', year: 'numeric' });
    const fy = document.getElementById('footer-year');
    if (fy) fy.textContent = new Date().getFullYear();

    // load everything (data-driven)
    loadHero();
    loadAbout();
    loadEducation();
    renderPublications();
    loadProjects();
    loadCourses();
    loadMedia();
    loadCertifications();
    loadAwards();
    loadGallery();
    loadContact();
    loadFooter();

    if (!isInitial) {
        setTimeout(() => {
            document.querySelectorAll('.fade-in').forEach(el => observeFade(el));
        }, 50);
    }
}

function applyStaticText() {
    const dict = uiText[currentLang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key] !== undefined) el.textContent = dict[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (dict[key] !== undefined) el.innerHTML = dict[key];
    });
}

function data() { return academicData[currentLang]; }

// ── HERO ──
function loadHero() {
    const p = data().personal;
    const t = uiText[currentLang];

    const nameEl = document.getElementById('hero-name-text');
    if (nameEl) nameEl.textContent = p.name;

    const topbarName = document.getElementById('topbar-name');
    if (topbarName) topbarName.textContent = p.name;

    const navBrand = document.getElementById('nav-brand-name');
    if (navBrand) navBrand.textContent = t.navBrand;

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

// ── ABOUT ──
function loadAbout() {
    const p = data().personal;
    const t = uiText[currentLang];
    const bioEl = document.getElementById('about-bio');
    if (bioEl) bioEl.textContent = p.bio;

    const linksEl = document.getElementById('about-links');
    if (linksEl) {
        linksEl.innerHTML = [
            { icon: '✉️', label: p.email, href: `mailto:${p.email}` },
            { icon: '📞', label: p.phone, href: `tel:${p.phone}` },
            { icon: '🔗', label: t.linkedinLabel, href: p.linkedin },
        ].filter(l => l.label).map(l => `<a href="${l.href}" class="about-link" target="_blank">${l.icon} ${l.label}</a>`).join('');
    }

    renderChips('skills-technical', data().skills.technical);
    renderChips('skills-research', data().skills.research);
    renderChips('skills-teaching', data().skills.teaching);
}

function renderChips(id, arr) {
    const el = document.getElementById(id);
    if (!el || !arr) return;
    el.innerHTML = arr.map(s => `<span class="chip">${s}</span>`).join('');
}

// ── EDUCATION ──
function loadEducation() {
    const el = document.getElementById('education-list');
    if (!el) return;
    el.innerHTML = (data().education || []).map(e => `
        <div class="edu-card fade-in visible">
            <div class="edu-year">📅 ${e.year}</div>
            <div class="edu-degree">${e.degree}</div>
            <div class="edu-inst">🏛 ${e.institution}</div>
            ${e.dissertation ? `<div class="edu-note">📝 ${e.dissertation}</div>` : ''}
            ${e.specialization ? `<div class="edu-note">🎯 ${e.specialization}</div>` : ''}
        </div>`).join('');
}

// ── PUBLICATIONS ──
function renderPublications() {
    const el = document.getElementById('publications-list');
    if (!el) return;
    const t = uiText[currentLang];
    let list = [...(academicData.publications || [])];

    list.sort((a, b) => pubSort === 'year'
        ? b.year - a.year
        : (b.citations || 0) - (a.citations || 0));

    if (pubFilter !== 'all') list = list.filter(p => p.type === pubFilter);

    el.innerHTML = list.map((pub, i) => `
        <div class="pub-item fade-in visible" data-type="${pub.type}">
            <div class="pub-bar ${pub.type}"></div>
            <div class="pub-body">
                <div class="pub-top-row">
                    <span class="pub-type-pill ${pub.type}">${pub.type === 'journal' ? t.journalLabel : t.conferenceLabel}</span>
                    <span class="pub-year-pill">📅 ${pub.year}</span>
                    ${pub.citations > 0 ? `<span class="pub-cite-pill">🔖 ${pub.citations} ${pub.citations > 1 ? t.citationsWord : t.citationWord}</span>` : ''}
                    <span class="pub-num">#${String(i + 1).padStart(2, '0')}</span>
                </div>
                <div class="pub-title">${pub.title}</div>
                <div class="pub-authors">${pub.authors}</div>
                <div class="pub-venue">${pub.venue}</div>
            </div>
        </div>`).join('');
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

// ── PROJECTS ──
function loadProjects() {
    const el = document.getElementById('projects-list');
    if (!el) return;
    const t = uiText[currentLang];
    el.innerHTML = (data().projects || []).map(p => `
        <div class="proj-card fade-in visible">
            <div class="proj-card-hdr">
                ${t.researchProjectHdr}
                <span class="proj-status ${(p.statusKey || p.status).toLowerCase()}">${p.status}</span>
            </div>
            <div class="proj-card-body">
                <div class="proj-title">${p.title}</div>
                <div class="proj-desc">${p.description}</div>
                <div class="proj-meta">
                    ${t.durationLabel} <span>${p.duration}</span><br>
                    ${p.funding ? `${t.fundingLabel} <span>${p.funding}</span>` : ''}
                </div>
                <div class="proj-tech-wrap">
                    ${p.technologies.map(tt => `<span class="proj-tech">${tt}</span>`).join('')}
                </div>
            </div>
        </div>`).join('');
}

// ── COURSES ──
function loadCourses() {
    const el = document.getElementById('courses-list');
    if (!el) return;
    el.innerHTML = (data().courses || []).map(c => `
        <div class="course-card fade-in visible">
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

// ── MEDIA / NEWS ──
function loadMedia() {
    const el = document.getElementById('media-list');
    if (!el) return;
    const t = uiText[currentLang];

    if (!data().media || data().media.length === 0) {
        el.innerHTML = `
            <div class="panel" style="grid-column:1/-1;padding:2rem;text-align:center;color:var(--text-muted)">
                <div style="font-size:2rem;margin-bottom:.8rem">📢</div>
                <div style="font-size:.9rem;margin-bottom:.5rem;color:var(--text)">${t.noMediaTitle}</div>
                <div style="font-size:.8rem">${t.noMediaDesc} <code style="background:var(--bg-card2);padding:.1rem .4rem;border-radius:3px;color:var(--orange)">media</code> ${t.noMediaDesc2} <code style="background:var(--bg-card2);padding:.1rem .4rem;border-radius:3px;color:var(--orange)">data.js</code></div>
            </div>`;
        return;
    }

    el.innerHTML = data().media.map(item => `
        <div class="media-card fade-in visible">
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
                    ? `<a href="${item.link}" target="_blank" class="media-link">${t.viewPost}</a>`
                    : ''}
                <div class="media-date">📅 ${item.date}</div>
            </div>
        </div>`).join('');
}

// ── CERTIFICATIONS ──
function loadCertifications() {
    const el = document.getElementById('certs-list');
    if (!el) return;
    const icons = ['☁️', '🎓', '💻', '🌐'];
    el.innerHTML = (data().certifications || []).map((c, i) => `
        <div class="cert-card fade-in visible">
            <div class="cert-icon-box">${icons[i % icons.length]}</div>
            <div>
                <div class="cert-title">${c.title}</div>
                <div class="cert-issuer">${c.issuer}</div>
                <div class="cert-year">📅 ${c.year}</div>
            </div>
        </div>`).join('');
}

// ── AWARDS ──
function loadAwards() {
    const el = document.getElementById('awards-list');
    if (!el) return;
    const icons = ['🏆', '🥇', '🎖️', '🌟'];
    el.innerHTML = (data().awards || []).map((a, i) => `
        <div class="award-card fade-in visible">
            <div class="award-icon">${icons[i % icons.length]}</div>
            <div class="award-title">${a.title}</div>
            <div class="award-meta">${a.issuer ? `<span>${a.issuer}</span> · ` : ''}<span>${a.year}</span></div>
        </div>`).join('');
}

// ── GALLERY ──
function loadGallery() {
    const el = document.getElementById('gallery-grid');
    if (!el) return;
    el.innerHTML = (data().gallery || []).map(item => `
        <div class="gal-item fade-in visible">
            <img src="${item.src}" alt="${item.alt}"
                onerror="this.parentElement.innerHTML='<div class=gal-placeholder>🖼️<br><span>${item.caption}</span></div>'">
            <div class="gal-caption">${item.caption}</div>
        </div>`).join('');
}

// ── CONTACT ──
function loadContact() {
    const p = data().personal;
    const t = uiText[currentLang];
    const ciEl = document.getElementById('contact-items');
    if (ciEl) {
        ciEl.innerHTML = [
            { icon: '✉️', label: t.labelEmail, value: `<a href="mailto:${p.email}">${p.email}</a>` },
            { icon: '📞', label: t.labelPhone, value: p.phone },
            { icon: '📍', label: t.labelLocation, value: t.locationValue },
        ].filter(i => i.value).map(i => `
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
            { icon: '🔗', label: t.linkedinLabel, href: p.linkedin },
            { icon: '🎓', label: t.scholarLabel, href: p.googleScholar },
            { icon: '🔬', label: t.researchGateLabel, href: p.researchGate },
            { icon: '🪪', label: t.orcidLabel, href: p.orcid },
        ].map(pr => `<a href="${pr.href}" target="_blank" class="profile-link">${pr.icon} ${pr.label} ↗</a>`).join('');
    }
}

// ── FOOTER ──
function loadFooter() {
    const p = data().personal;
    const fn = document.getElementById('footer-name');
    if (fn) fn.textContent = p.name;
    const fs = document.getElementById('footer-sub-text');
    if (fs) fs.textContent = `${p.title} · University of Babylon, Iraq`;
}
