
export interface Course {
  id: string;
  title: string;
  duration: string;
  price: number;
  validityDays?: number; // Validity in days
  originalPrice?: number;
  rating: number;
  icon: string; // Identifier for the icon
  color: string; // Tailwind gradient classes
  category: string;
  description: string;
  chapters: number;
  students: number;
  redirectLink?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[]; // Array of 4 options
  correctOptionIndex: number; // 0-3
  explanation?: string; // Explanation for the correct answer
}

export interface TestItem {
  id: string;
  courseId: string; // Link to specific course
  title: string;
  questions: Question[];
  timeMinutes: number;
  positiveMarks: number; // e.g. +4
  negativeMarks: number; // e.g. -1
  status?: 'locked' | 'available' | 'completed'; // UI state
  score?: number; // UI state for results
}

export interface TestResult {
  testId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  date: string;
}

export interface CourseResource {
  id: string;
  courseId: string;
  title: string;
  type: 'video' | 'live';
  url: string;
  date: string;
}

export enum DashboardTab {
  OVERVIEW = 'overview',
  SUBJECT_TESTS = 'subject_tests',
  CLASSROOM = 'classroom',
  ANALYTICS = 'analytics'
}
