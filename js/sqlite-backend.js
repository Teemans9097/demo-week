// SQLite backend connector for P.C SDG 4 Platform
// Works with Flask routes in app.py

async function api(path, data = null, method = 'POST') {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (data) options.body = JSON.stringify(data);
    const res = await fetch(path, options);
    return await res.json();
}

function showMessage(form, text, ok = true) {
    let box = form.querySelector('.db-message');
    if (!box) {
        box = document.createElement('div');
        box.className = 'db-message';
        form.prepend(box);
    }
    box.textContent = text;
    box.style.padding = '12px 14px';
    box.style.marginBottom = '14px';
    box.style.borderRadius = '12px';
    box.style.fontWeight = '800';
    box.style.background = ok ? 'rgba(34,197,94,.16)' : 'rgba(239,68,68,.16)';
    box.style.color = ok ? '#16a34a' : '#dc2626';
}

// SIGN UP: saves account into SQLite
const signupForm = document.querySelector('#signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const inputs = signupForm.querySelectorAll('input, select');
        const password = document.querySelector('#suPass')?.value || '';
        const confirm = document.querySelector('#suConfirm')?.value || '';
        if (password !== confirm) {
            showMessage(signupForm, 'Passwords do not match.', false);
            return;
        }
        const data = {
            full_name: document.querySelector('#suName')?.value || inputs[0]?.value || '',
            email: signupForm.querySelector('input[type="email"]')?.value || '',
            phone: inputs[2]?.value || '',
            district: signupForm.querySelectorAll('select')[0]?.value || '',
            class_level: signupForm.querySelectorAll('select')[1]?.value || '',
            role: signupForm.querySelectorAll('select')[1]?.value === 'Teacher' ? 'Teacher' : signupForm.querySelectorAll('select')[1]?.value === 'Parent' ? 'Parent' : 'Student',
            school: inputs[5]?.value || '',
            password: password
        };
        const result = await api('/api/signup', data);
        showMessage(signupForm, result.message, result.ok);
        if (result.ok) setTimeout(() => location.href = 'login.html', 1200);
    });
}

// LOGIN: checks SQLite user table and routes by role
const loginForm = document.querySelector('#loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            email: document.querySelector('#loginEmail')?.value || '',
            password: document.querySelector('#loginPass')?.value || '',
            role: document.querySelector('#loginRole')?.value || ''
        };
        const result = await api('/api/login', data);
        showMessage(loginForm, result.message || 'Login successful.', result.ok);
        if (result.ok && result.redirect) setTimeout(() => location.href = result.redirect, 800);
    });
}

// TWO STEP: required for teacher and admin accounts
const twoStepForm = document.querySelector('#twoStepForm');
if (twoStepForm) {
    twoStepForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const codeInput = twoStepForm.querySelector('input');
        const result = await api('/api/verify-2fa', { code: codeInput.value });
        showMessage(twoStepForm, result.message || 'Verified successfully.', result.ok);
        if (result.ok && result.redirect) setTimeout(() => location.href = result.redirect, 800);
    });
}

// CONTACT: saves message into SQLite
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const inputs = contactForm.querySelectorAll('input, textarea');
        const result = await api('/api/contact', {
            name: inputs[0]?.value || 'Website Visitor',
            email: inputs[1]?.value || '',
            message: inputs[2]?.value || ''
        });
        showMessage(contactForm, result.message, result.ok);
        if (result.ok) contactForm.reset();
    });
}

// STUDENT DASHBOARD: loads real activities from SQLite seed data
async function loadStudentDashboard() {
    const activityBox = document.querySelector('#studentActivityList') || document.querySelector('#studentActivities');
    const courseBox = document.querySelector('#studentCourseList') || document.querySelector('.course-mini')?.parentElement;
    const taskBox = document.querySelector('#studentTaskList');
    const recommendBox = document.querySelector('#recommendedLessons');
    const certBox = document.querySelector('#certificateList');
    if (!activityBox && !courseBox) return;

    const data = await fetch('/api/student-dashboard').then(r => r.json());
    if (!data.ok) return;

    if (activityBox) {
        activityBox.innerHTML = data.activities.map(a => `
            <div class="mini-row">
                <strong>✓ ${a.title}</strong>
                <span>${a.detail}</span>
                <small>${a.activity_date}</small>
            </div>
        `).join('');
    }

    if (courseBox) {
        courseBox.innerHTML = data.courses.map(c => `
            <div class="mini-row">
                <strong>${c.title}</strong>
                <span>Progress: ${c.progress}%</span>
                <div class="bar"><span style="width:${c.progress}%"></span></div>
                <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.6rem">
                    <a class="btn small" href="courses.html">Continue Learning</a>
                    <a class="btn outline small" href="resources.html">View Notes</a>
                    <a class="btn outline small" href="tools.html">Take Quiz</a>
                </div>
            </div>
        `).join('');
    }

    if (taskBox) {
        taskBox.innerHTML = data.tasks.map(t => `<div class="mini-row"><strong>${t.title}</strong><span>${t.date}</span></div>`).join('');
    }

    if (recommendBox) {
        recommendBox.innerHTML = data.recommended.map(r => `<div class="mini-row"><strong>${r}</strong><span>Recommended because this area needs more revision.</span></div>`).join('');
    }

    if (certBox) {
        certBox.innerHTML = data.certificates.map(c => `<div class="mini-row"><strong>✓ ${c}</strong><button class="btn small">Download</button></div>`).join('');
    }
}
loadStudentDashboard();

// ADMIN SUMMARY: loads counts from SQLite
async function loadAdminSummary() {
    const box = document.querySelector('#adminDbSummary');
    if (!box) return;
    const data = await fetch('/api/admin/summary').then(r => r.json());
    if (!data.ok) return;
    box.innerHTML = `
        <div class="stat"><b>${data.total_users}</b><span>Total users in SQLite</span></div>
        <div class="stat"><b>${data.messages}</b><span>Contact messages</span></div>
        ${data.users_by_role.map(r => `<div class="stat"><b>${r.c}</b><span>${r.role}s</span></div>`).join('')}
    `;
}
loadAdminSummary();
