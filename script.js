// ========== PROJECTS DATA ==========
const projectsData = [
    {
        name: "AI-Powered ECG Monitoring & Arrhythmia Detection",
        nameAr: "نظام مراقبة ECG وكشف اضطرابات النظم بالذكاء الاصطناعي",
        preview: "AI system that analyzes ECG signals to detect arrhythmias and support early screening",
        previewAr: "نظام ذكاء اصطناعي يحلل إشارات ECG لاكتشاف اضطرابات النظم ودعم الكشف المبكر.",
        description: "Developed an AI-powered solution for ECG monitoring and arrhythmia detection. The project focused on preprocessing ECG signals, training and evaluating a classification model, and presenting results that support early screening. Key work included preparing the dataset, improving signal quality, and validating performance using standard evaluation metrics..",
        descriptionAr: "وتطوير حل يعتمد على الذكاء الاصطناعي لمراقبة إشارات ECG  اكتشاف اضطرابات نظم القلب. ركّز المشروع على معالجة الإشارة وتنظيف البيانات، تدريب وتقييم نموذج تصنيف، وعرض نتائج تساعد على الكشف المبكر. شمل العمل تجهيز مجموعة البيانات، تحسين جودة الإشارة، والتحقق من الأداء باستخدام مقاييس تقييم معتمدة.",
        technologies: ["Python", "NumPy", "Pandas", "Matplotlib", "Scikit-learn"],
        github: "https://github.com/sara-alqahtani/project1",
        image: "" // ضعي مسار الصورة هنا مثل: "images/project1.jpg"
    },
    {
        name: "Rafiq – Smart Islamic Companion",
        nameAr: "رفيق – المرافق الإسلامي الذكي",
        preview: "A mobile application that supports daily Islamic practices through prayer times, adhkar reminders, and smart assistance features.",
        previewAr: "تطبيق يساعد المستخدمين على تنظيم عباداتهم اليومية من خلال مواقيت الصلاة، الأذكار، وميزات ذكية مساعدة.",
        description: "Developed a mobile application designed to support daily Islamic practices and enhance spiritual routines. The app provides accurate prayer times, adhkar reminders, and guided daily supplications within a clean and user-friendly interface. The project focused on usability, structured navigation, and performance optimization to ensure a smooth user experience. Additional features included smart notifications and AI-assisted responses to provide helpful and relevant guidance.",
        descriptionAr: "تم تطوير تطبيق جوال يهدف إلى دعم العبادات اليومية وتعزيز الروتين الروحي للمستخدمين. يوفر التطبيق مواقيت صلاة دقيقة، تذكيرات بالأذكار، وأدعية يومية ضمن واجهة سهلة الاستخدام ومنظمة. ركز المشروع على سهولة الاستخدام، تنظيم التنقل داخل التطبيق، وتحسين الأداء لضمان تجربة سلسة. كما يتضمن إشعارات ذكية وميزات مدعومة بالذكاء الاصطناعي لتقديم إرشادات مفيدة وملائمة.",
        technologies: ["Flutter", "Dart", "Local Notifications", "API Integration", "AI-assisted features"],
        github: "https://github.com/sara-alqahtani/project2",
        image: "" // ضعي مسار الصورة هنا
    }
];

// ========== CERTIFICATES DATA ==========
const certificatesData = [
    {
        title: "Fundamentals of Artificial Intelligence",
        titleAr: "أساسيات الذكاء الاصطناعي",
        institution: "SDAIA",
        institutionAr: "سدايا",
        file: "" // ضعي مسار ملف PDF أو صورة الشهادة هنا مثل: "certificates/ai-cert.pdf"
    },
    {
        title: "Artificial Intelligence Concepts and Advanced Applications",
        titleAr: "مفاهيم الذكاء الاصطناعي وتطبيقاته المتقدمة",
        institution: "SDAIA",
        institutionAr: "سدايا",
        file: "" // ضعي مسار الملف هنا
    },
        {
        title: "Introduction to Data Science",
        titleAr: "مقدمة في علم البيانات",
        institution: "Cisco Network Academy",
        institutionAr: "سيسكو",
        file: "" // ضعي مسار ملف PDF أو صورة الشهادة هنا مثل: "certificates/ai-cert.pdf"
    },
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
    renderCertificates();
    initializeProjectModal();
    initializeScrollAnimations();
    
    // Auto-scroll after 2.5 seconds on first visit - REMOVED
    // Now animations trigger when you actually see the section
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
    const imageContainer = document.getElementById('modal-image-container');

    title.textContent = currentLang === 'en' ? project.name : project.nameAr;
    description.textContent = currentLang === 'en' ? project.description : project.descriptionAr;
    
    // Handle project image
    if (project.image) {
        imageContainer.innerHTML = `<img src="${project.image}" alt="${project.name}" class="modal-image">`;
    } else {
        imageContainer.innerHTML = `<div class="modal-image-placeholder">📸</div>`;
    }
    
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

// ========== INTERESTS - Static Display ==========
// Interests now display all at once without rotation

// ========== SCROLL-TRIGGERED ANIMATIONS ==========
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.3, // يشتغل لما 30% من العنصر يظهر
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Hero title typing effect
                if (entry.target.classList.contains('hero-title')) {
                    entry.target.classList.add('typing');
                }
                
                // Hero subtitle fade in
                if (entry.target.classList.contains('hero-subtitle')) {
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, 2000); // بعد ما يخلص الـ typing
                }
                
                // Interests animation
                if (entry.target.id === 'interests-display') {
                    const items = entry.target.querySelectorAll('.interest-item');
                    items.forEach(item => item.classList.add('animate'));
                }
                
                // Section title animations
                if (entry.target.classList.contains('section-title')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
                
                // Cards animations
                if (entry.target.classList.contains('card') || 
                    entry.target.classList.contains('project-card')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            }
        });
    }, observerOptions);

    // Observe hero elements
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroTitle) observer.observe(heroTitle);
    if (heroSubtitle) observer.observe(heroSubtitle);
    
    // Observe interests
    const interestsDisplay = document.getElementById('interests-display');
    if (interestsDisplay) observer.observe(interestsDisplay);
    
    // Observe section titles
    document.querySelectorAll('.section-title').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
    
    // Observe cards
    document.querySelectorAll('.card, .project-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.5s ease';
        observer.observe(el);
    });
}

// ========== CERTIFICATES ==========
function renderCertificates() {
    const container = document.getElementById('certificates-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    certificatesData.forEach(cert => {
        const card = document.createElement('div');
        card.className = 'card clickable';
        card.innerHTML = `
            <h3 class="card-title">${currentLang === 'en' ? cert.title : cert.titleAr}</h3>
            <p class="card-subtitle">${currentLang === 'en' ? cert.institution : cert.institutionAr}</p>
        `;
        
        if (cert.file) {
            card.addEventListener('click', () => {
                window.open(cert.file, '_blank');
            });
        }
        
        container.appendChild(card);
    });
}

// Call render certificates on initialization
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code
    renderCertificates();
});