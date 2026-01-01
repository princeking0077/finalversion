
import { Course, TestItem, TestResult, Question, CourseResource } from '../types';
import { COURSES } from '../constants';

// Simulated Types
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'student' | 'admin';
  status: 'pending' | 'approved' | 'rejected'; // For students
  enrolledCourses: string[]; // Course IDs
}

const STORAGE_KEYS = {
  USERS: 'epa_users',
  TESTS: 'epa_tests',
  RESULTS: 'epa_test_results',
  RESOURCES: 'epa_course_resources',
  CURRENT_USER: 'epa_current_user'
};

// Initialize DB with Admin and Seed Data if empty
export const initDB = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const admin: User = {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@enlighten.com',
      password: 'admin', // Simple password for demo
      role: 'admin',
      status: 'approved',
      enrolledCourses: []
    };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([admin]));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.TESTS)) {
    // Start with empty tests
    localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.RESOURCES)) {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify([]));
  }
};

export const db = {
  getUsers: (): User[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },

  saveUser: (user: User) => {
    const users = db.getUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  updateUser: (updatedUser: User) => {
    const users = db.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  },

  findUser: (email: string): User | undefined => {
    const users = db.getUsers();
    return users.find(u => u.email === email);
  },

  getTests: (): TestItem[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TESTS) || '[]');
  },

  getTestById: (id: string): TestItem | undefined => {
    const tests = db.getTests();
    return tests.find(t => t.id === id);
  },

  saveTest: (test: TestItem) => {
    const tests = db.getTests();
    tests.push(test);
    localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(tests));
  },

  // Resources (Videos/Live Classes)
  getResources: (): CourseResource[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.RESOURCES) || '[]');
  },

  saveResource: (resource: CourseResource) => {
    const resources = db.getResources();
    resources.push(resource);
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
  },

  deleteResource: (id: string) => {
    const resources = db.getResources().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
  },

  // Results
  saveTestResult: (result: TestResult) => {
    const results: TestResult[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESULTS) || '[]');
    // Remove previous attempt if exists (optional logic)
    const filtered = results.filter(r => !(r.userId === result.userId && r.testId === result.testId));
    filtered.push(result);
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(filtered));
  },

  getUserResults: (userId: string): TestResult[] => {
    const results: TestResult[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESULTS) || '[]');
    return results.filter(r => r.userId === userId);
  },

  login: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    window.dispatchEvent(new Event('storage')); // Trigger update
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    window.dispatchEvent(new Event('storage')); // Trigger update
  },

  getCurrentUser: (): User | null => {
    const u = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return u ? JSON.parse(u) : null;
  }
};

// Run initialization
initDB();
