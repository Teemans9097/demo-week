from flask import Flask, request, jsonify, session, redirect, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3, os
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'database', 'pc_sdg4.db')
TWO_STEP_CODE = '246810'

app = Flask(__name__, static_folder=None)
app.secret_key = 'pc-sdg4-change-this-secret-key'

ROLE_DASHBOARDS = {
    'Student': '/student-dashboard.html',
    'Teacher': '/teacher-portal.html',
    'Parent': '/parent-portal.html',
    'Admin': '/admin.html'
}


def db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = db()
    conn.executescript('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        district TEXT,
        school TEXT,
        role TEXT NOT NULL,
        class_level TEXT,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS student_activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT NOT NULL,
        detail TEXT,
        activity_date TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        level TEXT,
        subject TEXT,
        progress INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT
    );
    ''')

    # Seed demo users only if database is empty
    existing = conn.execute('SELECT COUNT(*) AS c FROM users').fetchone()['c']
    if existing == 0:
        demo_users = [
            ('Tee Mans', 'student@pcsdg4.sl', '076000001', 'Western Area', 'Freetown Secondary School', 'Student', 'JSS 3', 'student123'),
            ('Mr. Conteh', 'teacher@pcsdg4.sl', '076000002', 'Bo', 'Bo Government School', 'Teacher', '', 'teacher123'),
            ('Mrs. Kamara', 'parent@pcsdg4.sl', '076000003', 'Kenema', 'Kenema Secondary School', 'Parent', '', 'parent123'),
            ('Platform Admin', 'admin@pcsdg4.sl', '076000004', 'Western Area', 'P.C SDG 4 Platform', 'Admin', '', 'admin123'),
        ]
        for name, email, phone, district, school, role, class_level, password in demo_users:
            conn.execute('''INSERT INTO users(full_name,email,phone,district,school,role,class_level,password_hash,created_at)
                            VALUES(?,?,?,?,?,?,?,?,?)''',
                         (name, email, phone, district, school, role, class_level, generate_password_hash(password), now()))
        student_id = conn.execute("SELECT id FROM users WHERE email='student@pcsdg4.sl'").fetchone()['id']
        activities = [
            ('Completed BECE Mathematics Quiz', 'Score: 82% · Algebra and fractions', 'Today, 9:30 AM'),
            ('Watched English Essay Writing Lesson', 'Completed low-data video lesson', 'Yesterday'),
            ('Downloaded WASSCE Physics Notes', 'Topic: Motion and force', '2 days ago'),
            ('Earned Quiz Champion Badge', 'Completed 5 quizzes above 80%', '3 days ago'),
        ]
        for title, detail, date in activities:
            conn.execute('INSERT INTO student_activities(user_id,title,detail,activity_date) VALUES(?,?,?,?)',
                         (student_id, title, detail, date))
        courses = [
            ('BECE Mathematics', 'JSS 3', 'Mathematics', 75),
            ('English Language', 'JSS 3', 'English', 60),
            ('Integrated Science', 'JSS 3', 'Science', 80),
            ('ICT Fundamentals', 'JSS 3', 'ICT', 90),
        ]
        for c in courses:
            conn.execute('INSERT INTO courses(title,level,subject,progress) VALUES(?,?,?,?)', c)
        conn.execute('INSERT INTO announcements(title,body,created_at) VALUES(?,?,?)',
                     ('New Scholarship Available', 'Students in JSS and SSS can view the scholarship portal for new opportunities.', now()))
        conn.commit()
    conn.close()


def now():
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')


def row_to_dict(row):
    return dict(row) if row else None


@app.before_request
def ensure_db():
    if not os.path.exists(DB_PATH):
        init_db()


@app.route('/')
def home():
    return send_from_directory(BASE_DIR, 'index.html')


@app.route('/<path:filename>')
def files(filename):
    return send_from_directory(BASE_DIR, filename)


@app.post('/api/signup')
def signup():
    data = request.get_json() or request.form
    full_name = data.get('full_name') or data.get('name')
    email = (data.get('email') or '').lower().strip()
    phone = data.get('phone') or ''
    district = data.get('district') or ''
    school = data.get('school') or ''
    role = data.get('role') or 'Student'
    class_level = data.get('class_level') or ''
    password = data.get('password') or ''

    if not full_name or not email or not password:
        return jsonify({'ok': False, 'message': 'Name, email and password are required.'}), 400

    try:
        conn = db()
        conn.execute('''INSERT INTO users(full_name,email,phone,district,school,role,class_level,password_hash,created_at)
                        VALUES(?,?,?,?,?,?,?,?,?)''',
                     (full_name, email, phone, district, school, role, class_level, generate_password_hash(password), now()))
        conn.commit()
        return jsonify({'ok': True, 'message': 'Account created successfully. You can now login.'})
    except sqlite3.IntegrityError:
        return jsonify({'ok': False, 'message': 'Email already exists.'}), 409
    finally:
        conn.close()


@app.post('/api/login')
def login():
    data = request.get_json() or request.form
    email = (data.get('email') or '').lower().strip()
    password = data.get('password') or ''
    role = data.get('role') or ''

    conn = db()
    user = conn.execute('SELECT * FROM users WHERE email=?', (email,)).fetchone()
    conn.close()

    if not user or not check_password_hash(user['password_hash'], password):
        return jsonify({'ok': False, 'message': 'Invalid email or password.'}), 401
    if role and user['role'] != role:
        return jsonify({'ok': False, 'message': 'Selected role does not match this account.'}), 403

    if user['role'] in ['Teacher', 'Admin']:
        session['pending_user_id'] = user['id']
        session['pending_role'] = user['role']
        return jsonify({'ok': True, 'two_step': True, 'redirect': '/two-step.html', 'message': 'Two-step verification required.'})

    session['user_id'] = user['id']
    session['role'] = user['role']
    return jsonify({'ok': True, 'redirect': ROLE_DASHBOARDS[user['role']]})


@app.post('/api/verify-2fa')
def verify_2fa():
    data = request.get_json() or request.form
    code = data.get('code') or ''
    if code != TWO_STEP_CODE:
        return jsonify({'ok': False, 'message': 'Wrong verification code.'}), 401
    session['user_id'] = session.pop('pending_user_id', None)
    role = session.pop('pending_role', None)
    session['role'] = role
    return jsonify({'ok': True, 'redirect': ROLE_DASHBOARDS.get(role, '/login.html')})


@app.get('/api/me')
def me():
    uid = session.get('user_id')
    if not uid:
        return jsonify({'ok': False, 'user': None})
    conn = db()
    user = conn.execute('SELECT id,full_name,email,phone,district,school,role,class_level,created_at FROM users WHERE id=?', (uid,)).fetchone()
    conn.close()
    return jsonify({'ok': True, 'user': row_to_dict(user)})


@app.get('/api/student-dashboard')
def student_dashboard():
    conn = db()
    user = conn.execute("SELECT id,full_name,district,school,class_level FROM users WHERE role='Student' LIMIT 1").fetchone()
    uid = user['id'] if user else 1
    activities = conn.execute('SELECT title,detail,activity_date FROM student_activities WHERE user_id=? ORDER BY id DESC', (uid,)).fetchall()
    courses = conn.execute('SELECT title,subject,progress FROM courses').fetchall()
    announcements = conn.execute('SELECT title,body,created_at FROM announcements ORDER BY id DESC LIMIT 5').fetchall()
    conn.close()
    return jsonify({
        'ok': True,
        'student': row_to_dict(user),
        'activities': [row_to_dict(r) for r in activities],
        'courses': [row_to_dict(r) for r in courses],
        'tasks': [
            {'title': 'BECE Mock Exam', 'date': '20 June 2026'},
            {'title': 'English Assignment', 'date': '22 June 2026'},
            {'title': 'Science Quiz', 'date': '25 June 2026'}
        ],
        'study_time': {'Mathematics': 5, 'English': 3, 'Science': 4, 'ICT': 2, 'Total': 14},
        'recommended': ['Algebra Basics', 'English Essay Structure', 'Photosynthesis Revision'],
        'certificates': ['Mathematics Basics', 'ICT Fundamentals', 'English Writing Skills'],
        'notifications': [row_to_dict(r) for r in announcements]
    })


@app.get('/api/admin/summary')
def admin_summary():
    conn = db()
    users = conn.execute('SELECT role, COUNT(*) c FROM users GROUP BY role').fetchall()
    total_users = conn.execute('SELECT COUNT(*) c FROM users').fetchone()['c']
    messages = conn.execute('SELECT COUNT(*) c FROM messages').fetchone()['c']
    conn.close()
    return jsonify({'ok': True, 'total_users': total_users, 'users_by_role': [row_to_dict(r) for r in users], 'messages': messages})


@app.post('/api/contact')
def contact():
    data = request.get_json() or request.form
    name = data.get('name') or 'Website Visitor'
    email = data.get('email') or ''
    message = data.get('message') or ''
    if not email or not message:
        return jsonify({'ok': False, 'message': 'Email and message are required.'}), 400
    conn = db()
    conn.execute('INSERT INTO messages(name,email,message,created_at) VALUES(?,?,?,?)', (name, email, message, now()))
    conn.commit()
    conn.close()
    return jsonify({'ok': True, 'message': 'Message saved in SQLite database.'})


@app.get('/api/logout')
def logout():
    session.clear()
    return redirect('/login.html')


if __name__ == '__main__':
    init_db()
    app.run(debug=True)
