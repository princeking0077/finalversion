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

// Debugging: Log all requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

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
                    enrolledCourses: []
                }],
                tests: [],
                resources: [],
                results: []
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
        return { users: [], tests: [], resources: [], results: [] };
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
            res.json({ success: true, user: userWithoutPass });
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
        db.users[index] = { ...db.users[index], ...updates };
        saveDB(db);
        res.json({ success: true, user: db.users[index] });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
});

// 4. Test & Resource Routes
apiRouter.get('/tests', (req, res) => {
    const db = getDB();
    res.json(db.tests);
});

apiRouter.post('/tests', (req, res) => {
    const newTest = req.body;
    const db = getDB();
    db.tests.push(newTest);
    saveDB(db);
    res.json({ success: true, test: newTest });
});

apiRouter.get('/resources', (req, res) => {
    const db = getDB();
    res.json(db.resources);
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
