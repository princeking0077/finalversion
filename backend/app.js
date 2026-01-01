import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cors from 'cors';
import bodyParser from 'body-parser';

// import 'dotenv/config'; // Commented out to prevent crash if node_modules missing

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

import crypto from 'crypto';
import multer from 'multer';

// File Upload Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Serve Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Debugging: Log all requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ==========================================
const SESSIONS_FILE = path.join(__dirname, 'data', 'sessions.json');

// Load Sessions
let SESSIONS = {};
try {
    if (fs.existsSync(SESSIONS_FILE)) {
        SESSIONS = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf-8'));
    }
} catch (e) {
    console.error("Failed to load sessions:", e);
}

const saveSessions = () => {
    try {
        fs.writeFileSync(SESSIONS_FILE, JSON.stringify(SESSIONS, null, 2));
    } catch (e) {
        console.error("Failed to save sessions:", e);
    }
};

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        // Allow unauthenticated for login/register/health/static
        // Allow unauthenticated for login/register/health/static AND public courses
        const p = req.path;
        if (
            p.startsWith('/auth') || p.startsWith('/api/auth') ||
            p === '/test' || p === '/api/test' ||
            p === '/health-check' || p === '/api/health-check' ||
            ((p === '/courses' || p === '/api/courses') && req.method === 'GET') ||
            !p.startsWith('/api')
        ) {
            return next();
        }
        return res.status(401).json({ success: false, message: 'Missing Authorization Token' });
    }

    const token = authHeader.replace('Bearer ', '');
    const session = SESSIONS[token];

    if (!session || new Date() > new Date(session.expiry)) {
        return res.status(401).json({ success: false, message: 'Invalid or Expired Token' });
    }

    const db = getDB();
    const user = db.users.find(u => u.id === session.userId);

    if (!user) {
        return res.status(401).json({ success: false, message: 'User not found for token' });
    }

    req.user = user;
    next();
};

app.use(authenticate);

// Helper to read/write DB
const getDB = () => {
    try {
        if (!fs.existsSync(DB_FILE)) {
            // Init if missing
            const initial = {
                users: [{
                    id: 'admin-1',
                    name: 'Admin User',
                    email: process.env.ADMIN_EMAIL || 'enlightenpharmaacademy@gmail.com',
                    password: process.env.ADMIN_PASSWORD || 'Sk@001001',
                    role: 'admin',
                    status: 'approved',
                    password: process.env.ADMIN_PASSWORD || 'Sk@001001',
                    role: 'admin',
                    status: 'approved',
                    enrolledCourses: [],
                    registrationId: 'ADMIN-001',
                    paymentStatus: 'verified',
                    screenshotSubmitted: false
                }],
                tests: [],
                resources: [],
                results: [],
                courses: [
                    {
                        id: 'gpat-2026',
                        title: 'GPAT 2026 Complete Course',
                        duration: '120+ Hrs',
                        price: 4999,
                        validityDays: 730,
                        originalPrice: 8000,
                        rating: 4.8,
                        icon: 'graduation',
                        color: 'from-emerald-500 to-teal-500',
                        category: 'National Level',
                        description: 'Comprehensive preparation for GPAT 2026 with live classes and test series.',
                        chapters: 45,
                        students: 1200
                    },
                    {
                        id: 'niper-mastery',
                        title: 'NIPER Entrance Mastery',
                        duration: '80+ Hrs',
                        price: 3999,
                        validityDays: 365,
                        originalPrice: 6000,
                        rating: 4.7,
                        icon: 'microscope',
                        color: 'from-violet-500 to-purple-500',
                        category: 'National Level',
                        description: 'Specialized coaching for NIPER JEE aspirants with advanced study material.',
                        chapters: 30,
                        students: 850
                    },
                    {
                        id: 'mpsc-di',
                        title: 'MPSC Drug Inspector Series',
                        duration: '30 Days',
                        price: 999,
                        validityDays: 180,
                        originalPrice: 1999,
                        rating: 4.6,
                        icon: 'briefcase',
                        color: 'from-blue-500 to-indigo-500',
                        category: 'State Level',
                        description: 'Targeted test series for Maharashtra Drug Inspector exams.',
                        chapters: 15,
                        students: 2000
                    },
                    {
                        id: 'dpee-prep',
                        title: 'DPEE Complete Preparation',
                        duration: '100+ Hrs',
                        price: 2999,
                        validityDays: 365,
                        originalPrice: 5000,
                        rating: 4.9,
                        icon: 'certificate',
                        color: 'from-orange-500 to-red-500',
                        category: 'Exit Exam',
                        description: 'Diploma Pharmacy Exit Exam full syllabus coverage.',
                        chapters: 40,
                        students: 500
                    }
                ]
            };
            fs.ensureDirectoryExists && fs.ensureDirectoryExists(path.dirname(DB_FILE)); // Safety check if using fs-extra, but we are using native fs, so:
            if (!fs.existsSync(path.dirname(DB_FILE))) {
                fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
            }
            fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
            return initial;
        }
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    } catch (e) {
        console.error("DB Read Error:", e);
        return { users: [], tests: [], resources: [], results: [], courses: [] };
    }
};

const saveDB = (data) => {
    try {
        if (!fs.existsSync(path.dirname(DB_FILE))) {
            fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
        }
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("DB Save Error:", e);
    }
};

// ==========================================
// API Router Definition
// ==========================================
const apiRouter = express.Router();

// 1. Health & Test
apiRouter.get('/test', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is working!', url: req.url });
});

apiRouter.get('/health-check', (req, res) => {
    try {
        const distPath = path.join(__dirname, '../dist');
        const rootPath = path.join(__dirname, '..');

        let distFiles = [];
        let rootFiles = [];

        if (fs.existsSync(distPath)) {
            distFiles = fs.readdirSync(distPath);
        } else {
            distFiles = ['DIST FOLDER MISSING'];
        }

        if (fs.existsSync(rootPath)) {
            rootFiles = fs.readdirSync(rootPath);
        }

        res.json({
            status: 'ok',
            cwd: process.cwd(),
            __dirname: __dirname,
            distPath: distPath,
            distExists: fs.existsSync(distPath),
            distContents: distFiles,
            rootContents: rootFiles
        });
    } catch (e) {
        res.status(500).json({ status: 'error', message: e.message });
    }
});

// 2. Auth Routes
apiRouter.post('/auth/login', (req, res) => {
    try {
        console.log('Login Request:', req.body);
        const { email, password } = req.body;
        const db = getDB();
        const user = db.users.find(u => u.email === email && u.password === password);

        if (user) {
            const { password, ...userWithoutPass } = user;

            // Expiry Check Logic
            if (user.role === 'student' && user.enrolledCourses && user.enrolledCourses.length > 0) {
                const today = new Date();
                let allExpired = true;

                // Check if ALL courses are expired
                user.enrolledCourses.forEach(cId => {
                    const expiryStr = user.courseExpiry ? user.courseExpiry[cId] : null;
                    if (!expiryStr || new Date(expiryStr) > today) {
                        allExpired = false;
                    }
                });

                if (allExpired) {
                    user.status = 'expired';
                    saveDB(db); // Persist expiration status
                    return res.status(403).json({
                        success: false,
                        message: 'Your account has expired as all your course enrollments have ended. Please contact admin to renew.'
                    });
                }
            }

            // General Status Check
            if (user.status === 'expired' || user.status === 'rejected' || user.status === 'inactive') {
                return res.status(403).json({ success: false, message: 'Account is ' + user.status + '. Please contact admin.' });
            }

            // Generate Session
            const token = crypto.randomUUID();
            SESSIONS[token] = {
                userId: user.id,
                expiry: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
            };
            saveSessions();

            res.json({ success: true, user: userWithoutPass, token });
        } else {
            console.log('Login Failed: Invalid credentials');
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (e) {
        console.error('Login Error:', e);
        res.status(500).json({ success: false, message: 'Server Login Error: ' + e.message });
    }
});

apiRouter.post('/auth/register', (req, res) => {
    try {
        const newUser = req.body;
        const db = getDB();

        if (db.users.find(u => u.email === newUser.email)) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        // Generate Registration ID
        const datePart = new Date().getFullYear();
        const randomPart = Math.floor(1000 + Math.random() * 9000);
        newUser.registrationId = `REG-${datePart}-${randomPart}`;
        console.log("Generated Reg ID:", newUser.registrationId, "for", newUser.email);

        newUser.paymentStatus = 'pending';
        newUser.screenshotSubmitted = false;
        newUser.status = 'pending'; // Default status until payment verified (or manual approval)

        db.users.push(newUser);
        saveDB(db);
        res.json({ success: true, message: 'Registration successful' });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

// 3. User Routes
apiRouter.get('/users', (req, res) => {
    const db = getDB();
    const safeUsers = db.users.map(({ password, ...u }) => u);
    res.json(safeUsers);
});

apiRouter.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const db = getDB();
    const index = db.users.findIndex(u => u.id === id);

    if (index !== -1) {
        // Handle Payment Verification Logic
        if (updates.paymentStatus === 'verified' && db.users[index].paymentStatus !== 'verified') {
            // Grant Access to selected course if implied, OR just approve user.
            // For now, if verification happens, we also Approve the user if they were pending.
            db.users[index].status = 'approved';
        }

        db.users[index] = { ...db.users[index], ...updates };
        saveDB(db);
        res.json({ success: true, user: db.users[index] });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
});

// 3.5 Course Routes
apiRouter.get('/courses', (req, res) => {
    const db = getDB();
    res.json(db.courses || []);
});

apiRouter.post('/courses', (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required' });
    const newCourse = req.body;
    const db = getDB();
    if (!db.courses) db.courses = [];
    db.courses.push(newCourse);
    saveDB(db);
    res.json({ success: true, course: newCourse });
});

apiRouter.put('/courses/:id', (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required' });
    const { id } = req.params;
    const updates = req.body;
    const db = getDB();
    if (!db.courses) db.courses = [];
    const index = db.courses.findIndex(c => c.id === id);

    if (index !== -1) {
        db.courses[index] = { ...db.courses[index], ...updates };
        saveDB(db);
        res.json({ success: true, course: db.courses[index] });
    } else {
        res.status(404).json({ success: false, message: 'Course not found' });
    }
});

apiRouter.delete('/courses/:id', (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required' });
    const { id } = req.params;
    const db = getDB();
    if (!db.courses) db.courses = [];
    db.courses = db.courses.filter(c => c.id !== id);
    saveDB(db);
    res.json({ success: true });
});

// 4. Test & Resource Routes
apiRouter.get('/tests', (req, res) => {
    const db = getDB();
    const user = req.user;

    if (user.role === 'admin') {
        return res.json(db.tests);
    }

    // Filter tests for students:
    // 1. Must be enrolled in the course
    // 2. Course must not be expired
    const validCourseIds = (user.enrolledCourses || []).filter(courseId => {
        const expiry = user.courseExpiry && user.courseExpiry[courseId];
        // If no expiry set, assume valid (or handle as expired depending on policy, assuming valid for legacy)
        // If expiry set, check date
        return !expiry || new Date(expiry) > new Date();
    });

    const studentTests = db.tests.filter(t => validCourseIds.includes(t.courseId));
    res.json(studentTests);
});

// 4.5 Leaderboard Route
apiRouter.get('/leaderboard', (req, res) => {
    try {
        const { courseId } = req.query;
        if (!courseId) return res.status(400).json({ success: false, message: 'Course ID required' });

        const db = getDB();
        const user = req.user;

        // Security: Check Enrollment if student
        if (user.role !== 'admin' && (!user.enrolledCourses || !user.enrolledCourses.includes(courseId))) {
            return res.status(403).json({ success: false, message: 'You are not enrolled in this course' });
        }

        // 1. Get tests for this course
        const courseTestIds = db.tests.filter(t => t.courseId === courseId).map(t => t.id);

        if (courseTestIds.length === 0) {
            return res.json({ leaderboard: [], userRank: null });
        }

        // 2. Get results for these tests
        const relevantResults = db.results.filter(r => courseTestIds.includes(r.testId));

        // 3. Aggregate scores
        const userScores = {}; // userId -> { score, testsTaken }
        relevantResults.forEach(r => {
            if (!userScores[r.userId]) {
                userScores[r.userId] = { score: 0, testsTaken: 0 };
            }
            userScores[r.userId].score += Number(r.score);
            userScores[r.userId].testsTaken += 1;
        });

        // 4. Form Leaderboard Array
        let fullLeaderboard = Object.entries(userScores).map(([uid, stats]) => {
            const u = db.users.find(usr => usr.id === uid);
            return {
                userId: uid,
                name: u ? u.name : 'Unknown Student',
                score: stats.score,
                testsTaken: stats.testsTaken
            };
        });

        // 5. Sort by Score Descending
        fullLeaderboard.sort((a, b) => b.score - a.score);

        // 6. Assign Ranks
        fullLeaderboard = fullLeaderboard.map((entry, index) => ({ ...entry, rank: index + 1 }));

        // 7. Role-based Response
        if (user.role === 'admin') {
            return res.json({ leaderboard: fullLeaderboard });
        } else {
            const top10 = fullLeaderboard.slice(0, 10);
            const userEntry = fullLeaderboard.find(e => e.userId === user.id);
            return res.json({ leaderboard: top10, userRank: userEntry || null });
        }

    } catch (e) {
        console.error('Leaderboard Error:', e);
        res.status(500).json({ success: false, message: e.message });
    }
});

apiRouter.post('/tests', (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required' });
    const newTest = req.body;
    const db = getDB();
    db.tests.push(newTest);
    saveDB(db);
    res.json({ success: true, test: newTest });
});

apiRouter.put('/tests/:id', (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required' });
    const { id } = req.params;
    const updates = req.body;
    const db = getDB();
    const index = db.tests.findIndex(t => t.id === id);

    if (index !== -1) {
        // preserve ID just in case
        db.tests[index] = { ...db.tests[index], ...updates, id };
        saveDB(db);
        res.json({ success: true, test: db.tests[index] });
    } else {
        res.status(404).json({ success: false, message: 'Test not found' });
    }
});

apiRouter.delete('/tests/:id', (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required' });
    const { id } = req.params;
    const db = getDB();
    const initialLength = db.tests.length;
    db.tests = db.tests.filter(t => t.id !== id);

    if (db.tests.length !== initialLength) {
        saveDB(db);
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, message: 'Test not found' });
    }
});

apiRouter.get('/resources', (req, res) => {
    const db = getDB();
    const user = req.user;

    if (user.role === 'admin') {
        return res.json(db.resources);
    }

    const validCourseIds = (user.enrolledCourses || []).filter(courseId => {
        const expiry = user.courseExpiry && user.courseExpiry[courseId];
        return !expiry || new Date(expiry) > new Date();
    });

    const studentResources = db.resources.filter(r => validCourseIds.includes(r.courseId));
    res.json(studentResources);
});

apiRouter.post('/resources', (req, res) => {
    const newRes = req.body;
    const db = getDB();
    db.resources.push(newRes);
    saveDB(db);
    res.json({ success: true, resource: newRes });
});

apiRouter.delete('/resources/:id', (req, res) => {
    const { id } = req.params;
    const db = getDB();
    db.resources = db.resources.filter(r => r.id !== id);
    saveDB(db);
    res.json({ success: true });
});

// 5. Result Routes
apiRouter.get('/results', (req, res) => {
    const db = getDB();
    const { userId } = req.query;
    if (userId) {
        const userResults = db.results.filter(r => r.userId === userId);
        return res.json(userResults);
    }
    res.json(db.results);
});

apiRouter.post('/results', (req, res) => {
    try {
        const newResult = req.body;
        const db = getDB();

        // Double Submission Check
        const existing = db.results.find(r => r.userId === newResult.userId && r.testId === newResult.testId);
        if (existing) {
            return res.status(400).json({ success: false, message: 'Test already submitted.' });
        }

        db.results.push(newResult);
        saveDB(db);
        res.json({ success: true, result: newResult });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

// 6. File Upload Route
apiRouter.post('/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        // Return relative path for frontend use
        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({ success: true, url: fileUrl });
    } catch (e) {
        console.error("Upload Error:", e);
        res.status(500).json({ success: false, message: 'File upload failed' });
    }
});

// ==========================================
// MOUNTING & STATIC FILES
// ==========================================

// Mount Router at both /api and root to handle potential path stripping
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Ensure this is BEFORE the SPA fallback
app.all('/api/*', (req, res) => {
    res.status(404).json({ success: false, message: `API Endpoint not found: ${req.method} ${req.url}` });
});

// Static Files (Move to bottom to ensure API routes are hit first)
app.use(express.static(path.join(__dirname, '../dist')));

// Debug Root Handler (Server-Side Rendering of Entry Check)
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, '../dist', 'entry.html');
    if (!fs.existsSync(indexPath)) {
        console.error('Entry file missing:', indexPath);
        // List dist contents for debugging
        try {
            const distPath = path.join(__dirname, '../dist');
            const files = fs.readdirSync(distPath);
            return res.status(500).send(`SETUP ERROR: 'dist/entry.html' is missing.<br>Contents of '${distPath}':<br>${files.join('<br>')}`);
        } catch (e) {
            return res.status(500).send(`SETUP ERROR: Could not read dist folder. Make sure 'npm run build' ran successfully.<br>Error: ${e.message}`);
        }
    }
    res.sendFile(indexPath);
});

// SPA Fallback for other routes
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, '../dist', 'entry.html');
    if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
    }
    res.status(404).send('Not Found (SPA index missing)');
});

// ==========================================
// BACKGROUND JOBS
// ==========================================

const checkExpiryAndNotify = () => {
    console.log(`[${new Date().toISOString()}] Running Daily Expiry Check...`);
    const db = getDB();
    const today = new Date();

    db.users.forEach(user => {
        if (!user.courseExpiry) return;

        Object.entries(user.courseExpiry).forEach(([courseId, expiryDate]) => {
            const expiry = new Date(expiryDate);
            const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            if (daysLeft > 0 && daysLeft <= 7) {
                // Simulate Email Notification
                console.log(`[NOTIFICATION] To: ${user.email} | Subject: Course Expiring Soon! | Body: Your course '${courseId}' expires in ${daysLeft} days. Renew now!`);
            } else if (daysLeft <= 0 && daysLeft > -1) { // Notify on day of expiry
                console.log(`[NOTIFICATION] To: ${user.email} | Subject: Course Expired | Body: Your course '${courseId}' has expired.`);
            }
        });
    });
};

// Run every 24 hours (86400000 ms)
// For demo, we run it once on startup too
setTimeout(checkExpiryAndNotify, 5000); // Run 5s after startup
setInterval(checkExpiryAndNotify, 24 * 60 * 60 * 1000);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
