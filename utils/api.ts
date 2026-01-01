/// <reference types="vite/client" />
import { TestItem, TestResult, CourseResource, Course, LeaderboardEntry, User } from '../types';
export type { User };

// API Base URL - In production, this might be dynamic, but for now relative path works if served from same origin
// API Base URL - Strict Production URL to avoid confusion
const API_URL = import.meta.env.PROD || window.location.hostname !== 'localhost'
    ? '/api'
    : 'http://localhost:3000/api';

console.log("API Configured at:", API_URL);



// Internal helper for authenticated requests
const request = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('epa_token');
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers as object || {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

    if (res.status === 401) {
        console.warn('Unauthorized access. Logging out...');
        api.logout();
        // Optional: redirect to login if not already there
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
        throw new Error('Session expired');
    }

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") === -1) {
        const text = await res.text();
        console.error("Non-JSON response:", text.substring(0, 100));
        throw new Error('Server error: Expected JSON but got HTML/Text');
    }

    if (!res.ok) {
        // Try parsing error message
        try {
            const err = await res.json();
            throw new Error(err.message || `Error ${res.status}`);
        } catch (e) {
            throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
    }

    return res.json();
};

export const api = {
    // Auth
    login: async (email: string, password: string): Promise<{ success: boolean; user?: User; message?: string; token?: string }> => {
        try {
            // using fetch directly for login to handle custom logic
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.success && data.user) {
                localStorage.setItem('epa_user', JSON.stringify(data.user));
                if (data.token) {
                    localStorage.setItem('epa_token', data.token);
                }
                window.dispatchEvent(new Event('storage'));
            }
            return data;
        } catch (e: any) {
            console.error('Login Network Error:', e);
            return { success: false, message: e.message || 'Network error' };
        }
    },

    register: async (user: User): Promise<{ success: boolean; message: string }> => {
        try {
            return await request('/auth/register', {
                method: 'POST',
                body: JSON.stringify(user),
            });
        } catch (e: any) {
            return { success: false, message: e.message };
        }
    },

    logout: () => {
        localStorage.removeItem('epa_user');
        localStorage.removeItem('epa_token');
        window.dispatchEvent(new Event('storage'));
        window.location.href = '/login';
    },

    getCurrentUser: (): User | null => {
        const u = localStorage.getItem('epa_user');
        return u ? JSON.parse(u) : null;
    },

    // Users
    getUsers: async (): Promise<User[]> => {
        return await request('/users');
    },

    updateUser: async (id: string, updates: Partial<User>) => {
        return await request(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    },

    // Tests
    getTests: async (): Promise<TestItem[]> => {
        return await request('/tests');
    },

    saveTest: async (test: TestItem) => {
        return await request('/tests', {
            method: 'POST',
            body: JSON.stringify(test),
        });
    },

    updateTest: async (id: string, test: Partial<TestItem>) => {
        return await request(`/tests/${id}`, {
            method: 'PUT',
            body: JSON.stringify(test)
        });
    },

    deleteTest: async (id: string) => {
        return await request(`/tests/${id}`, {
            method: 'DELETE'
        });
    },

    // Courses
    getCourses: async (): Promise<Course[]> => {
        return await request('/courses');
    },

    createCourse: async (course: Partial<Course>) => {
        return await request('/courses', {
            method: 'POST',
            body: JSON.stringify(course)
        });
    },

    updateCourse: async (id: string, updates: Partial<Course>) => {
        return await request(`/courses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    },

    deleteCourse: async (id: string) => {
        return await request(`/courses/${id}`, {
            method: 'DELETE'
        });
    },

    getResources: async (): Promise<CourseResource[]> => {
        return await request('/resources');
    },

    saveResource: async (resource: CourseResource) => {
        return await request('/resources', {
            method: 'POST',
            body: JSON.stringify(resource),
        });
    },

    deleteResource: async (id: string) => {
        return await request(`/resources/${id}`, { method: 'DELETE' });
    },

    // Results
    saveTestResult: async (result: TestResult) => {
        return await request('/results', {
            method: 'POST',
            body: JSON.stringify(result),
        });
    },

    getUserResults: async (userId: string): Promise<TestResult[]> => {
        return await request(`/results?userId=${userId}`);
    },

    // Leaderboard
    getLeaderboard: async (courseId: string): Promise<{ leaderboard: LeaderboardEntry[], userRank?: LeaderboardEntry }> => {
        return await request(`/leaderboard?courseId=${courseId}`);
    },

    // Uploads
    uploadImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('image', file);

        const token = localStorage.getItem('epa_token');
        const res = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: formData
        });

        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        return data.url;
    }
};
