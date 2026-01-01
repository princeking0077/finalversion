
import { Course, FaqItem, TestItem, Question } from './types';

export const COURSES: Course[] = [
  {
    id: 'gpat-2026',
    title: 'GPAT 2026 Complete Course',
    duration: '120+ Hrs',
    price: 4999,
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
    originalPrice: 5000,
    rating: 4.9,
    icon: 'certificate',
    color: 'from-orange-500 to-red-500',
    category: 'Exit Exam',
    description: 'Diploma Pharmacy Exit Exam full syllabus coverage.',
    chapters: 40,
    students: 500
  }
];

export const FAQS: FaqItem[] = [
  {
    question: "Do I need prior experience to take your courses?",
    answer: "Not at all! Our pharmacy courses are designed for beginners as well as advanced learners."
  },
  {
    question: "How long do I have access to the course materials?",
    answer: "Access duration depends on the specific course — available till course completion or as per the plan (regular, extended, or lifetime)."
  },
  {
    question: "Can I ask questions or get live support during the course?",
    answer: "Yes, live doubt sessions and discussion groups are available."
  },
  {
    question: "Can I get a refund after enrolling?",
    answer: "We follow a no-refund policy once a course is purchased, as all study materials and content are instantly accessible after enrollment."
  }
];

// Empty mock tests array as requested to remove demo data
export const MOCK_TESTS: TestItem[] = [];

export const CONTACT_INFO = {
  email: "enlightenpharmaacademy@gmail.com",
  phone: "+91-9975900664",
  address: "Kranti Nagar, Near Nanded Railway Gate, Purna, Dist. Parbhani – 431511"
};
