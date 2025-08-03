// Academic CV Website JavaScript
// This file handles dynamic content loading and user interactions

document.addEventListener('DOMContentLoaded', function() {
    // Load all content when page is ready
    loadPublications();
    loadProjects();
    loadCourses();
    loadGallery();
    updateContactInfo();
    initializeAnimations();
    setupNavigation();
});

// Load publications from data.js
function loadPublications() {
    const publicationsContainer = document.getElementById('publications-list');
    
    if (academicData.publications.length === 0) {
        publicationsContainer.innerHTML = '<p class="loading">No publications available yet.</p>';
        return;
    }
    
    let publicationsHTML = '';
    
    academicData.publications.forEach(pub => {
        publicationsHTML += `
            <div class="publication-item fade-in">
                <div class="publication-title">${pub.title}</div>
                <div class="publication-authors">${pub.authors}</div>
                <div class="publication-venue">${pub.venue} (${pub.year})</div>
                ${pub.link && pub.link !== '#' ? `<a href="${pub.link}" target="_blank">View Publication</a>` : ''}
            </div>
        `;
    });
    
    publicationsContainer.innerHTML = publicationsHTML;
}

// Load projects from data.js
function loadProjects() {
    const projectsContainer = document.getElementById('projects-list');
    
    if (academicData.projects.length === 0) {
        projectsContainer.innerHTML = '<p class="loading">No projects available yet.</p>';
        return;
    }
    
    let projectsHTML = '';
    
    academicData.projects.forEach(project => {
        const techTags = project.technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');
        
        projectsHTML += `
            <div class="project-item fade-in">
                <div class="project-title">${project.title}</div>
                <div class="project-description">${project.description}</div>
                <p><strong>Duration:</strong> ${project.duration}</p>
                <p><strong>Status:</strong> ${project.status}</p>
                ${project.funding ? `<p><strong>Funding:</strong> ${project.funding}</p>` : ''}
                <div class="project-tech">${techTags}</div>
            </div>
        `;
    });
    
    projectsContainer.innerHTML = projectsHTML;
}

// Load courses from data.js
function loadCourses() {
    const coursesContainer = document.getElementById('courses-list');
    
    if (academicData.courses.length === 0) {
        coursesContainer.innerHTML = '<p class="loading">No courses available yet.</p>';
        return;
    }
    
    let coursesHTML = '';
    
    academicData.courses.forEach(course => {
        coursesHTML += `
            <div class="course-item fade-in">
                <div class="course-code">${course.code}</div>
                <div class="course-title">${course.title}</div>
                <div class="course-description">${course.description}</div>
                <p><strong>Level:</strong> ${course.level} | <strong>Semester:</strong> ${course.semester}</p>
            </div>
        `;
    });
    
    coursesContainer.innerHTML = coursesHTML;
}

// Load gallery from data.js
function loadGallery() {
    const galleryContainer = document.querySelector('.gallery-grid');
    
    if (academicData.gallery.length === 0) {
        galleryContainer.innerHTML = '<p class="loading">No gallery images available yet. You can add images by uploading them to the "images" folder and updating the data.js file.</p>';
        return;
    }
    
    let galleryHTML = '';
    
    academicData.gallery.forEach(item => {
        galleryHTML += `
            <div class="gallery-item fade-in">
                <img src="${item.src}" alt="${item.alt}" onerror="this.style.display='none'">
                <div class="gallery-caption">${item.caption}</div>
            </div>
        `;
    });
    
    galleryContainer.innerHTML = galleryHTML;
}

// Update contact information
function updateContactInfo() {
    const contactSection = document.getElementById('contact');
    const personal = academicData.personal;
    
    let contactHTML = '<h2>Contact</h2>';
    
    if (personal.email) {
        contactHTML += `<p>Email: <a href="mailto:${personal.email}">${personal.email}</a></p>`;
    }
    
    if (personal.phone) {
        contactHTML += `<p>Phone: ${personal.phone}</p>`;
    }
    
    if (personal.linkedin) {
        contactHTML += `<p>LinkedIn: <a href="${personal.linkedin}" target="_blank">LinkedIn Profile</a></p>`;
    }
    
    if (personal.googleScholar) {
        contactHTML += `<p>Google Scholar: <a href="${personal.googleScholar}" target="_blank">Google Scholar Profile</a></p>`;
    }
    
    if (personal.researchGate) {
        contactHTML += `<p>ResearchGate: <a href="${personal.researchGate}" target="_blank">ResearchGate Profile</a></p>`;
    }
    
    if (personal.orcid) {
        contactHTML += `<p>ORCID: <a href="${personal.orcid}" target="_blank">ORCID Profile</a></p>`;
    }
    
    contactSection.innerHTML = contactHTML;
    
    // Update header information
    const headerTitle = document.querySelector('header h1');
    const headerSubtitle = document.querySelector('header p');
    const pageTitle = document.querySelector('title');
    
    if (headerTitle) headerTitle.textContent = personal.name;
    if (headerSubtitle) headerSubtitle.textContent = personal.title + ' | ' + personal.subtitle;
    if (pageTitle) pageTitle.textContent = personal.name + ' - Academic Profile';
    
    // Update about section
    const aboutSection = document.querySelector('#about p');
    if (aboutSection && personal.bio) {
        aboutSection.textContent = personal.bio;
    }
}

// Initialize animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }, 100);
}

// Setup smooth navigation
function setupNavigation() {
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Utility function to add new publication (for future use)
function addPublication(publication) {
    academicData.publications.unshift(publication);
    loadPublications();
}

// Utility function to add new project (for future use)
function addProject(project) {
    academicData.projects.unshift(project);
    loadProjects();
}

// Utility function to add new course (for future use)
function addCourse(course) {
    academicData.courses.unshift(course);
    loadCourses();
}

// Search functionality (optional enhancement)
function searchContent(query) {
    const searchTerm = query.toLowerCase();
    const allContent = document.querySelectorAll('.publication-item, .project-item, .course-item');
    
    allContent.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            item.style.display = 'block';
            item.style.opacity = '1';
        } else {
            item.style.display = 'none';
            item.style.opacity = '0.5';
        }
    });
}

// Print-friendly version
function printCV() {
    window.print();
}

// Export data as JSON (for backup)
function exportData() {
    const dataStr = JSON.stringify(academicData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'academic-cv-data.json';
    link.click();
}

