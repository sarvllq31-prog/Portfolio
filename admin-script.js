// ============================================
// ADMIN DASHBOARD SCRIPT
// ============================================

let currentUser = null;

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initializeTabs();
    initializeLogout();
});

// ========== AUTH ==========
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        currentUser = session.user;
        showDashboard();
    } else {
        showLogin();
    }
}

function showLogin() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
    
    document.getElementById('login-form').addEventListener('submit', handleLogin);
}

function showDashboard() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    
    loadAllDashboardData();
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        
        currentUser = data.user;
        showDashboard();
    } catch (error) {
        errorEl.textContent = 'خطأ في تسجيل الدخول: ' + error.message;
    }
}

function initializeLogout() {
    document.getElementById('logout-btn').addEventListener('click', async () => {
        await supabase.auth.signOut();
        location.reload();
    });
}

// ========== TABS ==========
function initializeTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

// ========== LOAD ALL DATA ==========
async function loadAllDashboardData() {
    await loadAboutData();
    await loadInterestsData();
    await loadSkillsData();
    await loadCertificatesData();
    await loadProjectsData();
    await loadEducationData();
    await loadContactData();
}

// ========== ABOUT ==========
async function loadAboutData() {
    const { data } = await supabase.from('about').select('*').single();
    if (data) {
        document.getElementById('about-text-en').value = data.text_en;
        document.getElementById('about-text-ar').value = data.text_ar;
    }
}

async function saveAbout() {
    const textEn = document.getElementById('about-text-en').value;
    const textAr = document.getElementById('about-text-ar').value;
    
    const { error } = await supabase
        .from('about')
        .update({ text_en: textEn, text_ar: textAr })
        .eq('id', (await supabase.from('about').select('id').single()).data.id);
    
    if (error) {
        alert('خطأ: ' + error.message);
    } else {
        alert('✅ تم الحفظ بنجاح!');
    }
}

// ========== INTERESTS ==========
async function loadInterestsData() {
    const { data } = await supabase.from('interests').select('*').order('display_order');
    const list = document.getElementById('interests-list');
    list.innerHTML = '';
    
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-info">
                <h3>${item.icon} ${item.title_en} / ${item.title_ar}</h3>
            </div>
            <div class="item-actions">
                <button class="btn-danger" onclick="deleteInterest('${item.id}')">حذف</button>
            </div>
        `;
        list.appendChild(card);
    });
}

async function addInterest() {
    const titleEn = document.getElementById('interest-title-en').value;
    const titleAr = document.getElementById('interest-title-ar').value;
    const icon = document.getElementById('interest-icon').value;
    
    const { error } = await supabase.from('interests').insert({
        title_en: titleEn,
        title_ar: titleAr,
        icon: icon
    });
    
    if (error) {
        alert('خطأ: ' + error.message);
    } else {
        alert('✅ تمت الإضافة!');
        loadInterestsData();
        document.getElementById('interest-title-en').value = '';
        document.getElementById('interest-title-ar').value = '';
        document.getElementById('interest-icon').value = '';
    }
}

async function deleteInterest(id) {
    if (!confirm('هل أنت متأكد؟')) return;
    
    await supabase.from('interests').delete().eq('id', id);
    loadInterestsData();
}

// ========== SKILLS ==========
async function loadSkillsData() {
    const { data } = await supabase.from('skills').select('*').order('display_order');
    const list = document.getElementById('skills-list');
    list.innerHTML = '';
    
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-info">
                <h3>${item.name_en} - ${item.percentage}%</h3>
                <p>${item.skill_type}</p>
            </div>
            <div class="item-actions">
                <button class="btn-danger" onclick="deleteSkill('${item.id}')">حذف</button>
            </div>
        `;
        list.appendChild(card);
    });
}

async function addSkill() {
    const nameEn = document.getElementById('skill-name-en').value;
    const nameAr = document.getElementById('skill-name-ar').value;
    const percentage = document.getElementById('skill-percentage').value;
    const type = document.getElementById('skill-type').value;
    
    const { error } = await supabase.from('skills').insert({
        name_en: nameEn,
        name_ar: nameAr,
        percentage: parseInt(percentage),
        skill_type: type
    });
    
    if (error) {
        alert('خطأ: ' + error.message);
    } else {
        alert('✅ تمت الإضافة!');
        loadSkillsData();
        document.getElementById('skill-name-en').value = '';
        document.getElementById('skill-name-ar').value = '';
        document.getElementById('skill-percentage').value = '';
    }
}

async function deleteSkill(id) {
    if (!confirm('هل أنت متأكد؟')) return;
    await supabase.from('skills').delete().eq('id', id);
    loadSkillsData();
}

// ========== CERTIFICATES ==========
async function loadCertificatesData() {
    const { data } = await supabase.from('certificates').select('*').order('display_order');
    const list = document.getElementById('certificates-list');
    list.innerHTML = '';
    
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-info">
                <h3>${item.title_en}</h3>
                <p>${item.organization_en}</p>
            </div>
            <div class="item-actions">
                <button class="btn-danger" onclick="deleteCertificate('${item.id}')">حذف</button>
            </div>
        `;
        list.appendChild(card);
    });
}

async function addCertificate() {
    const titleEn = document.getElementById('cert-title-en').value;
    const titleAr = document.getElementById('cert-title-ar').value;
    const orgEn = document.getElementById('cert-org-en').value;
    const orgAr = document.getElementById('cert-org-ar').value;
    const fileInput = document.getElementById('cert-file');
    
    let fileUrl = null;
    
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileName = `${Date.now()}_${file.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('certificates')
            .upload(fileName, file);
        
        if (uploadError) {
            alert('خطأ في رفع الملف: ' + uploadError.message);
            return;
        }
        
        const { data: { publicUrl } } = supabase.storage
            .from('certificates')
            .getPublicUrl(fileName);
        
        fileUrl = publicUrl;
    }
    
    const { error } = await supabase.from('certificates').insert({
        title_en: titleEn,
        title_ar: titleAr,
        organization_en: orgEn,
        organization_ar: orgAr,
        file_url: fileUrl
    });
    
    if (error) {
        alert('خطأ: ' + error.message);
    } else {
        alert('✅ تمت الإضافة!');
        loadCertificatesData();
        document.getElementById('cert-title-en').value = '';
        document.getElementById('cert-title-ar').value = '';
        document.getElementById('cert-org-en').value = '';
        document.getElementById('cert-org-ar').value = '';
        fileInput.value = '';
    }
}

async function deleteCertificate(id) {
    if (!confirm('هل أنت متأكد؟')) return;
    await supabase.from('certificates').delete().eq('id', id);
    loadCertificatesData();
}

// ========== PROJECTS ==========
async function loadProjectsData() {
    const { data } = await supabase.from('projects').select('*').order('display_order');
    const list = document.getElementById('projects-list');
    list.innerHTML = '';
    
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-info">
                <h3>${item.title_en}</h3>
                <p>${item.short_desc_en}</p>
            </div>
            <div class="item-actions">
                <button class="btn-danger" onclick="deleteProject('${item.id}')">حذف</button>
            </div>
        `;
        list.appendChild(card);
    });
}

async function addProject() {
    const titleEn = document.getElementById('project-title-en').value;
    const titleAr = document.getElementById('project-title-ar').value;
    const shortEn = document.getElementById('project-short-en').value;
    const shortAr = document.getElementById('project-short-ar').value;
    const fullEn = document.getElementById('project-full-en').value;
    const fullAr = document.getElementById('project-full-ar').value;
    const toolsStr = document.getElementById('project-tools').value;
    const github = document.getElementById('project-github').value;
    const demo = document.getElementById('project-demo').value;
    const imagesInput = document.getElementById('project-images');
    
    const tools = toolsStr.split(',').map(t => t.trim());
    const imageUrls = [];
    
    if (imagesInput.files.length > 0) {
        for (let file of imagesInput.files) {
            const fileName = `${Date.now()}_${file.name}`;
            
            const { error: uploadError } = await supabase.storage
                .from('project-images')
                .upload(fileName, file);
            
            if (!uploadError) {
                const { data: { publicUrl } } = supabase.storage
                    .from('project-images')
                    .getPublicUrl(fileName);
                
                imageUrls.push(publicUrl);
            }
        }
    }
    
    const { error } = await supabase.from('projects').insert({
        title_en: titleEn,
        title_ar: titleAr,
        short_desc_en: shortEn,
        short_desc_ar: shortAr,
        full_desc_en: fullEn,
        full_desc_ar: fullAr,
        tools: tools,
        github_url: github,
        demo_url: demo,
        image_urls: imageUrls
    });
    
    if (error) {
        alert('خطأ: ' + error.message);
    } else {
        alert('✅ تمت الإضافة!');
        loadProjectsData();
        document.getElementById('project-title-en').value = '';
        document.getElementById('project-title-ar').value = '';
        document.getElementById('project-short-en').value = '';
        document.getElementById('project-short-ar').value = '';
        document.getElementById('project-full-en').value = '';
        document.getElementById('project-full-ar').value = '';
        document.getElementById('project-tools').value = '';
        document.getElementById('project-github').value = '';
        document.getElementById('project-demo').value = '';
        imagesInput.value = '';
    }
}

async function deleteProject(id) {
    if (!confirm('هل أنت متأكد؟')) return;
    await supabase.from('projects').delete().eq('id', id);
    loadProjectsData();
}

// ========== EDUCATION ==========
async function loadEducationData() {
    const { data } = await supabase.from('education').select('*').order('display_order');
    const list = document.getElementById('education-list');
    list.innerHTML = '';
    
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-info">
                <h3>${item.degree_en}</h3>
                <p>${item.organization_en} (${item.start_date} - ${item.end_date})</p>
            </div>
            <div class="item-actions">
                <button class="btn-danger" onclick="deleteEducation('${item.id}')">حذف</button>
            </div>
        `;
        list.appendChild(card);
    });
}

async function addEducation() {
    const degreeEn = document.getElementById('edu-degree-en').value;
    const degreeAr = document.getElementById('edu-degree-ar').value;
    const orgEn = document.getElementById('edu-org-en').value;
    const orgAr = document.getElementById('edu-org-ar').value;
    const start = document.getElementById('edu-start').value;
    const end = document.getElementById('edu-end').value;
    
    const { error } = await supabase.from('education').insert({
        degree_en: degreeEn,
        degree_ar: degreeAr,
        organization_en: orgEn,
        organization_ar: orgAr,
        start_date: start,
        end_date: end
    });
    
    if (error) {
        alert('خطأ: ' + error.message);
    } else {
        alert('✅ تمت الإضافة!');
        loadEducationData();
        document.getElementById('edu-degree-en').value = '';
        document.getElementById('edu-degree-ar').value = '';
        document.getElementById('edu-org-en').value = '';
        document.getElementById('edu-org-ar').value = '';
        document.getElementById('edu-start').value = '';
        document.getElementById('edu-end').value = '';
    }
}

async function deleteEducation(id) {
    if (!confirm('هل أنت متأكد؟')) return;
    await supabase.from('education').delete().eq('id', id);
    loadEducationData();
}

// ========== CONTACT ==========
async function loadContactData() {
    const { data } = await supabase.from('contact').select('*').single();
    if (data) {
        document.getElementById('contact-email').value = data.email;
        document.getElementById('contact-phone').value = data.phone;
        document.getElementById('contact-github').value = data.github_url;
        document.getElementById('contact-linkedin').value = data.linkedin_url;
    }
}

async function saveContact() {
    const email = document.getElementById('contact-email').value;
    const phone = document.getElementById('contact-phone').value;
    const github = document.getElementById('contact-github').value;
    const linkedin = document.getElementById('contact-linkedin').value;
    
    const { error } = await supabase
        .from('contact')
        .update({
            email,
            phone,
            github_url: github,
            linkedin_url: linkedin
        })
        .eq('id', (await supabase.from('contact').select('id').single()).data.id);
    
    if (error) {
        alert('خطأ: ' + error.message);
    } else {
        alert('✅ تم الحفظ بنجاح!');
    }
}
