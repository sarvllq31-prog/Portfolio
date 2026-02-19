// ========== PROJECTS DATA ==========
const projectsData = [
    {
        name: "Project Name 1",
        nameAr: "اسم المشروع 1",
        preview: "Brief project description",
        previewAr: "وصف مختصر للمشروع",
        description: "Detailed project description goes here. Add information about goals, challenges, and outcomes.",
        descriptionAr: "وصف تفصيلي للمشروع هنا. أضف معلومات عن الأهداف والتحديات والنتائج.",
        technologies: ["Python", "TensorFlow", "Pandas"],
        github: "https://github.com/sara-alqahtani/project1"
    },
    {
        name: "Project Name 2",
        nameAr: "اسم المشروع 2",
        preview: "Brief project description",
        previewAr: "وصف مختصر للمشروع",
        description: "Detailed project description goes here. Add information about goals, challenges, and outcomes.",
        descriptionAr: "وصف تفصيلي للمشروع هنا. أضف معلومات عن الأهداف والتحديات والنتائج.",
        technologies: ["Python", "Scikit-learn", "Matplotlib"],
        github: "https://github.com/sara-alqahtani/project2"
    }
];

// ========== STATE MANAGEMENT ==========
let currentLang = localStorage.getItem('lang') || 'en';
let currentTheme = localStorage.getItem('theme') || 'light';
let hasAutoScrolled = localStorage.getItem('hasAutoScrolled') === 'true';

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeLanguage();
    initializeNavigation();
    initializeTabs();
    renderProjects();
    initializeInterestsRotation();
    initializeProjectModal();
    
    // Auto-scroll after 2.5 seconds on first visit
    if (!hasAutoScrolled) {
        setTimeout(() => {
            document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
            localStorage.setItem('hasAutoScrolled', 'true');
        }, 2500);
    }
});

// ========== THEME ==========
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeButton();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeButton();
}

function updateThemeButton() {
    const btn = document.getElementById('theme-toggle');
    const span = btn.querySelector('span');
    if (currentTheme === 'dark') {
        span.setAttribute('data-en', '☀️ Light');
        span.setAttribute('data-ar', '☀️ فاتح');
        span.textContent = currentLang === 'en' ? '☀️ Light' : '☀️ فاتح';
    } else {
        span.setAttribute('data-en', '🌙 Dark');
        span.setAttribute('data-ar', '🌙 داكن');
        span.textContent = currentLang === 'en' ? '🌙 Dark' : '🌙 داكن';
    }
}

document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

// ========== LANGUAGE ==========
function initializeLanguage() {
    document.documentElement.lang = currentLang;
    document.body.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    updateAllText();
    updateLangButton();
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    document.documentElement.lang = currentLang;
    document.body.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('lang', currentLang);
    updateAllText();
    updateLangButton();
    renderProjects(); // Re-render projects with new language
}

function updateAllText() {
    document.querySelectorAll('[data-en][data-ar]').forEach(el => {
        el.textContent = el.getAttribute(`data-${currentLang}`);
    });
}

function updateLangButton() {
    const btn = document.getElementById('lang-toggle');
    btn.querySelector('span').textContent = currentLang === 'en' ? 'AR' : 'EN';
}

document.getElementById('lang-toggle').addEventListener('click', toggleLanguage);

// ========== NAVIGATION ==========
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active section highlight
        let current = '';
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 100) {
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

// ========== TABS ==========
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${target}-tab`).classList.add('active');
        });
    });
}

// ========== PROJECTS ==========
function renderProjects() {
    const grid = document.getElementById('projects-grid');
    grid.innerHTML = '';
    
    projectsData.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <h3 class="project-name">${currentLang === 'en' ? project.name : project.nameAr}</h3>
            <p class="project-preview">${currentLang === 'en' ? project.preview : project.previewAr}</p>
        `;
        card.addEventListener('click', () => openProjectModal(project));
        grid.appendChild(card);
    });
}

function initializeProjectModal() {
    const modal = document.getElementById('project-modal');
    const closeBtn = modal.querySelector('.modal-close');
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

function openProjectModal(project) {
    const modal = document.getElementById('project-modal');
    const title = document.getElementById('modal-title');
    const description = document.getElementById('modal-description');
    const tags = document.getElementById('modal-tags');
    const github = document.getElementById('modal-github');

    title.textContent = currentLang === 'en' ? project.name : project.nameAr;
    description.textContent = currentLang === 'en' ? project.description : project.descriptionAr;
    
    tags.innerHTML = '';
    project.technologies.forEach(tech => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = tech;
        tags.appendChild(tag);
    });

    github.href = project.github;
    modal.classList.add('active');
}

// ========== INTERESTS ROTATION ==========
function initializeInterestsRotation() {
    const items = document.querySelectorAll('.interest-item');
    let currentIndex = 0;

    setInterval(() => {
        items[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % items.length;
        items[currentIndex].classList.add('active');
    }, 3000);
}