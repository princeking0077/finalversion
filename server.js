import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cors from 'cors';
import bodyParser from 'body-parser';

import 'dotenv/config'; // Load env vars

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Debugging: Log all requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Test Endpoint
app.get('/api/test', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is working!' });
});

// ... (Existing API Routes) ...
// Ensure this is BEFORE the SPA fallback
app.all('/api/*', (req, res) => {
    res.status(404).json({ success: false, message: `API Endpoint not found: ${req.method} ${req.url}` });
});

// SPA Fallback

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
            fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
            return initial;
        }
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    } catch (e) {
        return { users: [], tests: [], resources: [], results: [] };
    }
};

const saveDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// API Routes

// Auth
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const db = getDB();
    const user = db.users.find(u => u.email === email && u.password === password);

    if (user) {
        // In a real app we would sign a token, here we return the user object
        // sensitive info removal
        const { password, ...userWithoutPass } = user;
        res.json({ success: true, user: userWithoutPass });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.post('/api/auth/register', (req, res) => {
    const newUser = req.body;
    const db = getDB();

    if (db.users.find(u => u.email === newUser.email)) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    db.users.push(newUser);
    saveDB(db);
    res.json({ success: true, message: 'Registration successful' });
});

// Users
app.get('/api/users', (req, res) => {
    const db = getDB();
    // Return all users but hide passwords
    const safeUsers = db.users.map(({ password, ...u }) => u);
    res.json(safeUsers);
});

app.put('/api/users/:id', (req, res) => {
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

// Tests
app.get('/api/tests', (req, res) => {
    const db = getDB();
    res.json(db.tests);
});

app.post('/api/tests', (req, res) => {
    const newTest = req.body;
    const db = getDB();
    db.tests.push(newTest);
    saveDB(db);
    res.json({ success: true, test: newTest });
});

// Resources
app.get('/api/resources', (req, res) => {
    const db = getDB();
    res.json(db.resources);
});

app.post('/api/resources', (req, res) => {
    const newRes = req.body;
    const db = getDB();
    db.resources.push(newRes);
    saveDB(db);
    res.json({ success: true, resource: newRes });
});

app.delete('/api/resources/:id', (req, res) => {
    const { id } = req.params;
    const db = getDB();
    db.resources = db.resources.filter(r => r.id !== id);
    saveDB(db);
    res.json({ success: true });
});

// SPA Fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
