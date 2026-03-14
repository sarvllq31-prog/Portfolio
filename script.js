// ============================================
// PORTFOLIO - MAIN SCRIPT
// ============================================

let currentLang = 'en';
let currentTheme = 'light';
let supabaseClient;

// Initialize Supabase
function initSupabase() {
    const { createClient } = window.supabase;
    supabaseClient = createClient(
        window.SUPABASE_CONFIG.url,
        window.SUPABASE_CONFIG.anonKey
    );
    console.log('✅ Supabase initialized');
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', async () => {
    initSupabase();
    initializeTheme();
    initializeLanguage();
    initializeNavigation();
    initializeAdminLogin();
    await loadAllData();
    initializeScrollAnimations();
});

// ========== THEME TOGGLE ==========
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    setTheme(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
}

function setTheme(theme) {
    currentTheme = theme;
    document.body.className = theme === 'dark' ? 'dark-mode' : 'light-mode';
    localStorage.setItem('theme', theme);
    
    const icon = document.querySelector('#theme-toggle .icon');
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ========== LANGUAGE TOGGLE ==========
function initializeLanguage() {
    const langToggle = document.getElementById('lang-toggle');
    const savedLang = localStorage.getItem('language') || 'en';
    
    setLanguage(savedLang);
    
    langToggle.addEventListener('click', () => {
        const newLang = currentLang === 'en' ? 'ar' : 'en';
        setLanguage(newLang);
    });
}

function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('language', lang);
    
    document.querySelectorAll('[data-en][data-ar]').forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });
    
    loadAllData();
}

// ========== NAVIGATION ==========
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    window.addEventListener('scroll', () => {
        let current = '';
        document.querySelectorAll('.section').forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 100) {
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

// ========== SCROLL ANIMATIONS ==========
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.card, .skill-card, .project-card').forEach(el => {
        observer.observe(el);
    });
}

// ========== LOAD DATA FROM SUPABASE ==========
async function loadAllData() {
    try {
        await Promise.all([
            loadAbout(),
            loadInterests(),
            loadSkills(),
            loadCertificates(),
            loadProjects(),
            loadEducation(),
            loadContact()
        ]);
        console.log('✅ All data loaded');
    } catch (error) {
        console.error('❌ Error loading data:', error);
    }
}

async function loadAbout() {
    try {
        const { data, error } = await supabaseClient
            .from('about')
            .select('*')
            .single();
        
        if (error) throw error;
        
        const aboutText = document.getElementById('about-text');
        aboutText.textContent = currentLang === 'en' ? data.text_en : data.text_ar;
    } catch (error) {
        console.error('Error loading about:', error);
    }
}

async function loadInterests() {
    try {
        const { data, error } = await supabaseClient
            .from('interests')
            .select('*')
            .order('display_order');
        
        if (error) throw error;
        
        const container = document.getElementById('interests-container');
        container.innerHTML = '';
        
        data.forEach(interest => {
            const item = document.createElement('div');
            item.className = 'interest-item';
            item.innerHTML = `
                <div class="interest-icon">${interest.icon}</div>
                <div class="interest-name">${currentLang === 'en' ? interest.title_en : interest.title_ar}</div>
            `;
            container.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading interests:', error);
    }
}

async function loadSkills() {
    try {
        const { data, error } = await supabaseClient
            .from('skills')
            .select('*')
            .order('display_order');
        
        if (error) throw error;
        
        const technicalContainer = document.getElementById('technical-skills');
        const softContainer = document.getElementById('soft-skills');
        
        technicalContainer.innerHTML = '';
        softContainer.innerHTML = '';
        
        data.forEach(skill => {
            const skillEl = createSkillElement(skill);
            if (skill.skill_type === 'technical') {
                technicalContainer.appendChild(skillEl);
            } else {
                softContainer.appendChild(skillEl);
            }
        });
    } catch (error) {
        console.error('Error loading skills:', error);
    }
}

function createSkillElement(skill) {
    const div = document.createElement('div');
    div.className = 'skill-item';
    div.innerHTML = `
        <div class="skill-header">
            <span class="skill-name">${currentLang === 'en' ? skill.name_en : (skill.name_ar || skill.name_en)}</span>
            <span class="skill-percentage">${skill.percentage}%</span>
        </div>
        <div class="skill-bar">
            <div class="skill-progress" style="width: ${skill.percentage}%"></div>
        </div>
    `;
    return div;
}

async function loadCertificates() {
    try {
        const { data, error } = await supabaseClient
            .from('certificates')
            .select('*')
            .order('display_order');
        
        if (error) throw error;
        
        const container = document.getElementById('certificates-container');
        container.innerHTML = '';
        
        data.forEach(cert => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3 class="card-title">${currentLang === 'en' ? cert.title_en : cert.title_ar}</h3>
                <p class="card-subtitle">${currentLang === 'en' ? cert.organization_en : cert.organization_ar}</p>
                <p class="card-hint">${currentLang === 'en' ? 'Click to view certificate' : 'اضغط لعرض الشهادة'}</p>
            `;
            
            if (cert.file_url) {
                card.addEventListener('click', () => openCertificate(cert.file_url));
            }
            
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading certificates:', error);
    }
}

function openCertificate(url) {
    const modal = document.getElementById('certificate-modal');
    const viewer = document.getElementById('certificate-viewer');
    
    const isPDF = url.toLowerCase().endsWith('.pdf');
    
    if (isPDF) {
        viewer.innerHTML = `<iframe src="${url}" width="100%" height="600px"></iframe>`;
    } else {
        viewer.innerHTML = `<img src="${url}" alt="Certificate">`;
    }
    
    modal.classList.add('active');
}

function closeCertificateModal() {
    document.getElementById('certificate-modal').classList.remove('active');
}

async function loadProjects() {
    try {
        const { data, error } = await supabaseClient
            .from('projects')
            .select('*')
            .order('display_order');
        
        if (error) throw error;
        
        const container = document.getElementById('projects-container');
        container.innerHTML = '';
        
        data.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            
            const imageUrls = Array.isArray(project.image_urls) ? project.image_urls : [];
            const firstImage = imageUrls[0];
            
            card.innerHTML = `
                ${firstImage 
                    ? `<img src="${firstImage}" alt="${project.title_en}" class="project-thumbnail">`
                    : `<div class="project-placeholder">📁</div>`
                }
                <div class="project-info">
                    <h3 class="project-name">${currentLang === 'en' ? project.title_en : project.title_ar}</h3>
                    <p class="project-short-desc">${currentLang === 'en' ? project.short_desc_en : project.short_desc_ar}</p>
                </div>
            `;
            
            card.addEventListener('click', () => openProject(project));
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

function openProject(project) {
    const modal = document.getElementById('project-modal');
    
    document.getElementById('project-title').textContent = currentLang === 'en' ? project.title_en : project.title_ar;
    document.getElementById('project-description').textContent = currentLang === 'en' ? project.full_desc_en : project.full_desc_ar;
    
    const imagesContainer = document.getElementById('project-images');
    const imageUrls = Array.isArray(project.image_urls) ? project.image_urls : [];
    
    if (imageUrls.length > 0) {
        imagesContainer.innerHTML = imageUrls.map(url => 
            `<img src="${url}" alt="Project" class="project-image">`
        ).join('');
    } else {
        imagesContainer.innerHTML = '<div class="project-placeholder">📸</div>';
    }
    
    const toolsContainer = document.getElementById('project-tools');
    const tools = Array.isArray(project.tools) ? project.tools : [];
    toolsContainer.innerHTML = tools.map(tool => 
        `<span class="tool-tag">${tool}</span>`
    ).join('');
    
    document.getElementById('project-github').href = project.github_url || '#';
    
    const demoBtn = document.getElementById('project-demo');
    if (project.demo_url) {
        demoBtn.href = project.demo_url;
        demoBtn.style.display = 'inline-block';
    } else {
        demoBtn.style.display = 'none';
    }
    
    modal.classList.add('active');
}

function closeProjectModal() {
    document.getElementById('project-modal').classList.remove('active');
}

async function loadEducation() {
    try {
        const { data, error } = await supabaseClient
            .from('education')
            .select('*')
            .order('display_order');
        
        if (error) throw error;
        
        const container = document.getElementById('education-container');
        container.innerHTML = '';
        
        data.forEach(edu => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.position = 'relative';
            card.innerHTML = `
                <span class="card-date">${edu.start_date} - ${edu.end_date}</span>
                <h3 class="card-title">${currentLang === 'en' ? edu.degree_en : edu.degree_ar}</h3>
                <p class="card-subtitle">${currentLang === 'en' ? edu.organization_en : edu.organization_ar}</p>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading education:', error);
    }
}

async function loadContact() {
    try {
        const { data, error } = await supabaseClient
            .from('contact')
            .select('*')
            .single();
        
        if (error) throw error;
        
        const emailLinks = document.querySelectorAll('#hero-email, #contact-email');
        const phoneLinks = document.querySelectorAll('#hero-phone, #contact-phone');
        const githubLinks = document.querySelectorAll('#hero-github, #contact-github');
        const linkedinLinks = document.querySelectorAll('#hero-linkedin, #contact-linkedin');
        
        emailLinks.forEach(link => link.href = `mailto:${data.email}`);
        phoneLinks.forEach(link => link.href = `tel:${data.phone}`);
        githubLinks.forEach(link => link.href = data.github_url);
        linkedinLinks.forEach(link => link.href = data.linkedin_url);
        
    } catch (error) {
        console.error('Error loading contact:', error);
    }
}
// ========== ADMIN LOGIN MODAL ==========
function initializeAdminLogin() {
    const adminBtn = document.getElementById('admin-btn');
    const adminModal = document.getElementById('admin-modal');
    const adminOverlay = document.getElementById('admin-overlay');
    const adminClose = document.getElementById('admin-modal-close');
    const adminForm = document.getElementById('admin-login-form');
    const adminError = document.getElementById('admin-login-error');
    const adminSubmit = document.getElementById('admin-submit-btn');

    function openAdminModal() {
        adminModal.classList.add('active');
        document.getElementById('admin-email').focus();
    }

    function closeAdminModal() {
        adminModal.classList.remove('active');
        adminError.textContent = '';
    }

    adminBtn.addEventListener('click', async () => {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
            window.location.href = 'admin.html';
        } else {
            openAdminModal();
        }
    });

    adminOverlay.addEventListener('click', closeAdminModal);
    adminClose.addEventListener('click', closeAdminModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAdminModal();
    });

    adminForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('admin-email').value;
        const password = document.getElementById('admin-password').value;

        adminSubmit.disabled = true;
        adminSubmit.innerHTML = '<span>...</span>';
        adminError.textContent = '';

        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
            if (error) throw error;
            window.location.href = 'admin.html';
        } catch (err) {
            adminError.textContent = currentLang === 'ar'
                ? 'خطأ: ' + err.message
                : 'Login failed: ' + err.message;
            adminSubmit.disabled = false;
            adminSubmit.innerHTML = `<span data-en="Sign In" data-ar="دخول">Sign In</span>`;
        }
    });
}
