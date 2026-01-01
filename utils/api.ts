import { TestItem, TestResult, CourseResource } from '../types';

// API Base URL - In production, this might be dynamic, but for now relative path works if served from same origin
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string; // Optional in response
    role: 'student' | 'admin';
    status: 'pending' | 'approved' | 'rejected';
    enrolledCourses: string[];
}

export const api = {
    // Auth
    login: async (email: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> => {
        try {
            console.log(`Attempting login for ${email} at ${API_URL}/auth/login`);
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (!res.ok) {
                console.error('Login Fetch Error:', res.status, res.statusText);
                throw new Error(`Server returned ${res.status} ${res.statusText}`);
            }
            const data = await res.json();
            if (data.success && data.user) {
                localStorage.setItem('epa_user', JSON.stringify(data.user));
                window.dispatchEvent(new Event('storage'));
            }
            return data;
        } catch (e) {
            console.error('Login Network Error Detail:', e);
            return { success: false, message: 'Network error. Please check console for details.' };
        }
    },

    register: async (user: User): Promise<{ success: boolean; message: string }> => {
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });
            if (!res.ok) {
                console.error('Register Fetch Error:', res.status, res.statusText);
                throw new Error(`Server returned ${res.status} ${res.statusText}`);
            }
            return await res.json();
        } catch (e) {
            console.error('Register Network Error Detail:', e);
            return { success: false, message: 'Network error. Please check console for details.' };
        }
    },

    logout: () => {
        localStorage.removeItem('epa_user');
        window.dispatchEvent(new Event('storage'));
    },

    getCurrentUser: (): User | null => {
        const u = localStorage.getItem('epa_user');
        return u ? JSON.parse(u) : null;
    },

    // Users
    getUsers: async (): Promise<User[]> => {
        const res = await fetch(`${API_URL}/users`);
        return await res.json();
    },

    updateUser: async (id: string, updates: Partial<User>) => {
        await fetch(`${API_URL}/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
    },

    // Tests
    getTests: async (): Promise<TestItem[]> => {
        const res = await fetch(`${API_URL}/tests`);
        return await res.json();
    },

    saveTest: async (test: TestItem) => {
        await fetch(`${API_URL}/tests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(test),
        });
    },

    // Resources
    getResources: async (): Promise<CourseResource[]> => {
        const res = await fetch(`${API_URL}/resources`);
        return await res.json();
    },

    saveResource: async (resource: CourseResource) => {
        await fetch(`${API_URL}/resources`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(resource),
        });
    },

    deleteResource: async (id: string) => {
        await fetch(`${API_URL}/resources/${id}`, { method: 'DELETE' });
    },

    // Results - Keeping strictly local for now or TODO implement backend
    // For MVP professional upgrade, results often stay local or need another endpoint.
    // I'll create a simple endpoint or keep it local for now to avoid complexity overload unless requested.
    // Let's implement a simple local fallback for results to avoid breaking errors, 
    // or a placeholder if I didn't add the endpoint in server.js (I didn't). 
    // I will just use local storage for results as it wasn't a core requirement "Admin login check", "Registration".
    // But for "Professional", result tracking is good. I will stick to LocalStorage for Results for now
    // to minimize risk, as the user emphasized "without errors".
    saveTestResult: (result: TestResult) => {
        const STORAGE_KEY = 'epa_test_results';
        const results: TestResult[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const filtered = results.filter(r => !(r.userId === result.userId && r.testId === result.testId));
        filtered.push(result);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    },

    getUserResults: (userId: string): TestResult[] => {
        const results: TestResult[] = JSON.parse(localStorage.getItem('epa_test_results') || '[]');
        return results.filter(r => r.userId === userId);
    }
};
