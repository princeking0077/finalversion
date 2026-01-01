
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  BarChart2,
  Play,
  CheckCircle,
  Clock,
  TrendingUp,
  LogOut,
  Bell,
  Search,
  ChevronRight,
  User as UserIcon,
  Award,
  Filter,
  PieChart,
  ExternalLink,
  Video,
  MonitorPlay,
  Bookmark,
  Menu,
  X,
  RefreshCw,
  Plus
} from 'lucide-react';
import { api, User } from '../utils/api';
import { TestItem, DashboardTab, TestResult, CourseResource, Course } from '../types';
import { COURSES } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Logo } from '../components/Logo';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState(DashboardTab.OVERVIEW); // Default to overview
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Data States
  const [assignedTests, setAssignedTests] = useState<TestItem[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [resources, setResources] = useState<CourseResource[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const loadData = async (currentUser: User) => {
    try {
      // Parallel fetch for speed
      const [latestUser, allTests, userResults, allResources, allCourses] = await Promise.all([
        api.getCurrentUser() ? api.getUsers().then(users => users.find(u => u.id === currentUser.id)) : Promise.resolve(null),
        api.getTests(),
        api.getUserResults(currentUser.id),
        api.getResources(),
        api.getCourses()
      ]);

      if (latestUser) {
        setUser(latestUser);
        localStorage.setItem('epa_user', JSON.stringify(latestUser));
        // Use latest user for filtering
        const myTests = allTests.filter(t => latestUser.enrolledCourses?.includes(t.courseId));
        setAssignedTests(myTests);

        const myResources = allResources.filter(r => latestUser.enrolledCourses?.includes(r.courseId));
        setResources(myResources);

        const myCourses = allCourses.filter(c => latestUser.enrolledCourses?.includes(c.id));
        setCourses(myCourses);
      }
    } catch (e) {
      console.error("Failed to load dashboard data", e);
    }
  };

  useEffect(() => {
    const init = async () => {
      const currentUser = api.getCurrentUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }
      setUser(currentUser);
      await loadData(currentUser);
    };
    init();
  }, [navigate]);

  // Auto-Refresh every 30 seconds
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      loadData(user);
    }, 30000); // 30s
    return () => clearInterval(interval);
  }, [user]);

  const handleManualRefresh = async () => {
    if (user) await loadData(user);
  };

  if (!user) return null;

  const handleNavClick = (tab: DashboardTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-950 font-sans overflow-hidden">

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Responsive) */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-white/5 flex flex-col shadow-2xl md:shadow-none transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <div className="pl-2">
            <Logo className="h-6 w-6" />
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center space-x-3 mb-6 bg-slate-800/50 p-3 rounded-xl border border-white/5">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-teal-500/20 ring-1 ring-white/10">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">Student</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: DashboardTab.OVERVIEW, icon: LayoutDashboard, label: 'Overview' },
              { id: DashboardTab.SUBJECT_TESTS, icon: BookOpen, label: 'Assessments' },
              { id: DashboardTab.CLASSROOM, icon: Video, label: 'My Classroom' },
              { id: DashboardTab.BROWSE_COURSES, icon: Plus, label: 'Browse Courses' },
              { id: DashboardTab.ANALYTICS, icon: BarChart2, label: 'Analytics' },
              { id: DashboardTab.LEADERBOARD, icon: Award, label: 'Leaderboard' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden ${activeTab === item.id
                  ? 'bg-teal-500/10 text-teal-400 shadow-[inset_0_0_0_1px_rgba(20,184,166,0.2)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
              >
                {activeTab === item.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 rounded-r-full"></div>
                )}
                <item.icon className={`mr-3 h-5 w-5 transition-colors ${activeTab === item.id ? 'text-teal-400' : 'text-slate-500 group-hover:text-white'}`} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-white/5 bg-slate-900/50">
          <button
            onClick={() => { api.logout(); navigate('/'); }}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut className="mr-3 h-5 w-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-950 relative w-full">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-teal-900/10 to-transparent pointer-events-none"></div>

        {/* Top Header */}
        <header className="h-16 md:h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-6 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3 md:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-400 hover:text-white">
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-bold text-white">Enlighten</h2>
          </div>

          <div className="hidden md:flex items-center text-slate-400 text-sm">
            <span className="mr-2">Session:</span>
            <span className="text-teal-400 font-mono font-bold">Active</span>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative group hidden sm:block">
              <Search className="h-4 w-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-teal-500 transition-colors" />
              <input type="text" placeholder="Search..." className="bg-slate-950 border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm text-white focus:ring-1 focus:ring-teal-500 outline-none w-48 transition-all focus:w-64 focus:bg-slate-900" />
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <button className="p-2 md:p-2.5 text-slate-400 hover:text-white transition-colors relative hover:bg-white/5 rounded-full border border-transparent hover:border-white/10">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 md:top-2.5 right-2 md:right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-900 animate-pulse"></span>
            </button>
            <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar">
          <div className="max-w-7xl mx-auto animate-fade-in pb-20 md:pb-10">
            {activeTab === DashboardTab.OVERVIEW && <OverviewTab setActiveTab={setActiveTab} user={user} assignedTests={assignedTests} results={results} />}
            {activeTab === DashboardTab.SUBJECT_TESTS && <AssignedTestsTab tests={assignedTests} results={results} user={user} onRefresh={handleManualRefresh} />}
            {activeTab === DashboardTab.CLASSROOM && <ClassroomTab resources={resources} user={user} courses={courses} />}
            {activeTab === DashboardTab.BROWSE_COURSES && <BrowseCoursesTab user={user} />}
            {activeTab === DashboardTab.ANALYTICS && <AnalyticsTab results={results} />}
            {activeTab === DashboardTab.LEADERBOARD && <LeaderboardTab courses={courses} user={user} />}
          </div>
        </div>
      </main>
    </div>
  );
};

const OverviewTab = ({ setActiveTab, user, assignedTests, results }: { setActiveTab: (t: DashboardTab) => void, user: User, assignedTests: TestItem[], results: TestResult[] }) => {
  const avgScore = results.length > 0
    ? Math.round(results.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions * 100), 0) / results.length)
    : 0;

  const pendingTests = assignedTests.length - results.length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative">
        <div className="absolute -top-6 -left-6 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight font-heading">
            Welcome back, <span className="bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">{user.name.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-slate-400 text-sm md:text-base flex items-center gap-2">
            <span className="hidden sm:inline">Your learning journey continues.</span>
            Here's your daily summary
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {[
          { label: 'Pending Tests', value: pendingTests, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', gradient: 'from-amber-500/10 to-transparent' },
          { label: 'Completed', value: results.length, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', gradient: 'from-emerald-500/10 to-transparent' },
          { label: 'Accuracy', value: `${avgScore}%`, icon: TrendingUp, color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20', gradient: 'from-indigo-500/10 to-transparent' },
          { label: 'Courses', value: user.enrolledCourses.length, icon: BookOpen, color: 'text-teal-400', bg: 'bg-teal-400/10', border: 'border-teal-400/20', gradient: 'from-teal-500/10 to-transparent' },
        ].map((stat, i) => (
          <div key={i} className={`glass - card p - 4 md:p - 6 rounded - 2xl border ${stat.border} hover: bg - white / 5 hover: transform hover: -translate - y - 1 transition - all duration - 300 group relative overflow - hidden shadow - lg`}>
            <div className={`absolute inset - 0 bg - gradient - to - br ${stat.gradient} opacity - 0 group - hover: opacity - 100 transition - opacity`}></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-3 md:mb-4">
                <div className={`p - 2 md:p - 3 rounded - xl ${stat.bg} group - hover: scale - 110 transition - transform shadow - md border border - white / 10`}>
                  <stat.icon className={`h - 5 w - 5 md:h - 6 md:w - 6 ${stat.color} `} />
                </div>
                {i === 0 && pendingTests > 0 && <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span></span>}
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight">{stat.value}</p>
              <p className="text-[10px] md:text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Action Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900/80 to-slate-900 border border-teal-500/20 p-6 md:p-8 flex flex-col justify-center gap-6 group shadow-2xl shadow-black/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-teal-500/20 transition-all duration-1000"></div>
            <div className="relative z-10 max-w-lg">
              <div className="inline-block px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold mb-4 border border-teal-500/20">NEXT STEPS</div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight font-heading">Ready to test your knowledge?</h3>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                {pendingTests > 0
                  ? `You have ${pendingTests} pending assessments waiting for you. Complete them to unlock new analytics.`
                  : "You're all caught up! Review your past performance or explore new courses to keep learning."}
              </p>
            </div>
            <div className="relative z-10">
              <button
                onClick={() => setActiveTab(DashboardTab.SUBJECT_TESTS)}
                className="px-6 md:px-8 py-3 bg-white text-slate-900 font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-teal-50 transition-all hover:scale-105 active:scale-95 flex items-center w-fit text-sm md:text-base"
              >
                {pendingTests > 0 ? 'Start Assessment' : 'View All Tests'} <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>

          {/* External Notes Link - Premium Card Design */}
          <a
            href="https://learnpharmacy.in"
            target="_blank"
            rel="noreferrer"
            className="group relative overflow-hidden rounded-3xl p-1 z-0 transition-transform duration-300 hover:-translate-y-1"
          >
            {/* Gradient Border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 opacity-50 group-hover:opacity-100 transition-opacity blur-sm"></div>

            <div className="relative h-full bg-slate-900 rounded-[22px] p-5 md:p-6 flex items-center justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[60px] rounded-full pointer-events-none"></div>

              <div className="relative z-10 flex items-center gap-4 md:gap-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-amber-300 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform duration-500 shrink-0">
                  <Bookmark className="h-6 w-6 md:h-8 md:w-8 text-slate-900 fill-current" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">B.Pharm & GPAT Notes</h3>
                  <p className="text-slate-400 text-xs md:text-sm max-w-sm">Unlock premium study materials, PDFs, and revision notes at LearnPharmacy.in</p>
                </div>
              </div>

              <div className="hidden sm:flex h-10 w-10 bg-white/5 rounded-full items-center justify-center border border-white/10 group-hover:bg-amber-500 group-hover:text-slate-900 transition-all duration-300">
                <ExternalLink className="h-5 w-5" />
              </div>
            </div>
          </a>
        </div>

        {/* Recent Activity */}
        <div className="glass-card rounded-2xl border border-white/5 p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-slate-500" /> Recent Activity
          </h3>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {results.length > 0 ? (
              <div className="space-y-4">
                {results.slice(0, 5).map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400 border border-emerald-500/10">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-slate-200 font-medium text-sm">Test Completed</p>
                        <p className="text-[10px] text-slate-500 font-mono uppercase">{new Date(r.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                        {Math.round((r.score / r.totalQuestions) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm py-10">
                <Award className="h-8 w-8 mb-2 opacity-30" />
                <p>No recent activity recorded.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


const isCourseExpired = (courseId: string, user: User) => {
  if (!user.courseExpiry || !user.courseExpiry[courseId]) return false;
  return new Date(user.courseExpiry[courseId]) < new Date();
};

const ClassroomTab = ({ resources, user, courses }: { resources: CourseResource[], user: User, courses: Course[] }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Active Courses Section with Redirect Links */}
      {courses.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">My Active Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => (
              <div key={course.id} className="glass-card p-5 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-indigo-500/20 transition-all">
                <div>
                  <h3 className="font-bold text-white mb-1">{course.title}</h3>
                  <div className="text-xs text-slate-400">
                    {isCourseExpired(course.id, user) ? <span className="text-rose-400">Expired</span> : <span className="text-emerald-400">Active</span>}
                  </div>
                </div>
                {course.redirectLink && !isCourseExpired(course.id, user) && (
                  <a
                    href={course.redirectLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" /> Join Class
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white font-heading">My Classroom</h2>
          <p className="text-slate-400">Video lectures and live classes from your enrolled courses.</p>
        </div>
        <div className="text-right hidden md:block">
          <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded text-xs font-bold uppercase border border-indigo-500/20">
            {resources.length} Resources Available
          </span>
        </div>
      </div>

      {resources.length === 0 ? (
        <div className="glass-card p-16 text-center rounded-3xl border border-white/5 bg-slate-900/30 flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-500 shadow-inner">
            <Video className="h-10 w-10" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No Content Available</h3>
          <p className="text-slate-400 max-w-sm">Your instructors haven't posted any video lectures or live classes for your enrolled courses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {resources.map((res) => {
            const expired = isCourseExpired(res.courseId, user);
            const courseTitle = courses.find(c => c.id === res.courseId)?.title || 'Unknown Course';

            return (
              <div key={res.id} className={`glass-card rounded-2xl overflow-hidden border border-white/5 transition-all group flex flex-col ${expired ? 'opacity-60 grayscale' : 'hover:border-indigo-500/40 hover:-translate-y-2 hover:shadow-2xl'
                }`}>
                {/* Thumbnail Placeholder */}
                <div className="h-40 bg-slate-900 relative group-hover:bg-slate-800 transition-colors flex items-center justify-center overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-t ${res.type === 'video' ? 'from-indigo-900/80' : 'from-rose-900/80'} to-transparent opacity-60`}></div>

                  {expired ? (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-700 text-slate-400 border-2 border-slate-600">
                      <LogOut className="h-5 w-5" />
                    </div>
                  ) : (
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-white/20 backdrop-blur-sm transition-all group-hover:scale-110 ${res.type === 'video' ? 'bg-indigo-500 text-white' : 'bg-rose-500 text-white animate-pulse'}`}>
                      {res.type === 'video' ? <Play className="h-5 w-5 fill-current ml-1" /> : <MonitorPlay className="h-5 w-5" />}
                    </div>
                  )}

                  <span className={`absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded backdrop-blur-md border border-white/10 ${expired
                    ? 'bg-slate-800 text-slate-400'
                    : (res.type === 'video' ? 'bg-indigo-500/80 text-white' : 'bg-rose-500/80 text-white')
                    }`}>
                    {res.type}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-base font-bold text-white mb-2 line-clamp-2 leading-snug group-hover:text-indigo-400 transition-colors">{res.title}</h3>
                  <p className="text-xs text-slate-500 mb-6 flex items-center">
                    <BookOpen className="h-3 w-3 mr-1.5" />
                    {courseTitle}
                  </p>

                  {expired ? (
                    <button disabled className="mt-auto block w-full text-center py-2.5 bg-slate-800 border border-white/5 text-slate-500 rounded-lg text-sm font-bold cursor-not-allowed">
                      Course Expired
                    </button>
                  ) : (
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-auto block w-full text-center py-2.5 bg-white/5 border border-white/10 text-white rounded-lg text-sm font-bold hover:bg-indigo-600 hover:border-indigo-600 transition-all"
                    >
                      {res.type === 'video' ? 'Watch Now' : 'Join Session'}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const LeaderboardTab = ({ courses, user }: { courses: Course[], user: User }) => {
  const [selectedCourse, setSelectedCourse] = useState<string>(courses.length > 0 ? courses[0].id : '');
  const [leaderboard, setLeaderboard] = useState<import('../types').LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<import('../types').LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCourse) {
      loadLeaderboard();
    }
  }, [selectedCourse]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await api.getLeaderboard(selectedCourse);
      setLeaderboard(data.leaderboard);
      setMyRank(data.userRank || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center border border-yellow-500/50"><Award className="w-5 h-5" /></div>;
    if (rank === 2) return <div className="w-8 h-8 rounded-full bg-slate-300/20 text-slate-300 flex items-center justify-center border border-slate-300/50"><Award className="w-5 h-5" /></div>;
    if (rank === 3) return <div className="w-8 h-8 rounded-full bg-amber-700/20 text-amber-700 flex items-center justify-center border border-amber-700/50"><Award className="w-5 h-5" /></div>;
    return <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-sm">#{rank}</div>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-heading">Leaderboard</h2>
          <p className="text-slate-400">See where you stand among your peers.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="bg-slate-900 border border-white/10 text-white p-3 rounded-xl outline-none focus:border-indigo-500 min-w-[250px]"
          >
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
      </div>

      {myRank && (
        <div className="glass-card p-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Award className="w-32 h-32 text-indigo-500" />
          </div>
          <div className="relative z-10 flex items-center gap-6">
            <div className="text-center">
              <div className="text-xs text-indigo-300 uppercase font-bold mb-1">Your Rank</div>
              <div className="text-4xl font-black text-white">#{myRank.rank}</div>
            </div>
            <div className="h-12 w-px bg-indigo-500/30"></div>
            <div>
              <div className="text-xl font-bold text-white">{myRank.name}</div>
              <div className="text-indigo-200">{myRank.score} Points • {myRank.testsTaken} Tests</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-white/5">
          <h3 className="font-bold text-white">Top 10 Performers</h3>
        </div>
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading rankings...</div>
        ) : leaderboard.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No data available for this course yet.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {leaderboard.map((entry) => (
              <div key={entry.userId} className={`flex items-center justify-between p-4 ${entry.userId === user.id ? 'bg-indigo-500/10' : 'hover:bg-white/5'}`}>
                <div className="flex items-center gap-4">
                  {getRankBadge(entry.rank)}
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      {entry.name}
                      {entry.userId === user.id && <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full">YOU</span>}
                    </div>
                    <div className="text-xs text-slate-500">{entry.testsTaken} tests taken</div>
                  </div>
                </div>
                <div className="font-mono font-bold text-indigo-400 text-lg">
                  {entry.score}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AssignedTestsTab = ({ tests, results, user, onRefresh }: { tests: TestItem[], results: TestResult[], user: User, onRefresh: () => void }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const filteredTests = tests.filter(test => {
    const isCompleted = results.some(r => String(r.testId) === String(test.id));
    if (filter === 'pending') return !isCompleted;
    if (filter === 'completed') return isCompleted;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-white font-heading">Assessment Center</h2>
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-lg bg-slate-800 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-700 transition-all ${isRefreshing ? 'animate-spin text-teal-400' : ''}`}
            title="Refresh Results"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-xl border border-white/10 overflow-x-auto max-w-full">
          {(['all', 'pending', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${filter === f ? 'bg-teal-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filteredTests.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl border border-white/5 bg-slate-900/30">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
            <BookOpen className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No Tests Found</h3>
          <p className="text-slate-400 mt-2 max-w-sm mx-auto">There are no tests matching your current filter criteria.</p>
          <button onClick={() => setFilter('all')} className="mt-6 text-teal-400 hover:text-teal-300 text-sm font-bold underline">Clear Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map(test => {
            const result = results.find(r => String(r.testId) === String(test.id));
            const isCompleted = !!result;
            const percentage = isCompleted ? Math.round((result.score / result.totalQuestions) * 100) : 0;
            const expired = isCourseExpired(test.courseId, user) && !isCompleted;

            return (
              <div key={test.id} className={`glass-card rounded-2xl p-6 border transition-all duration-300 flex flex-col h-full group ${isCompleted
                ? 'border-emerald-500/20 hover:border-emerald-500/40'
                : expired
                  ? 'border-slate-700 opacity-70'
                  : 'border-white/10 hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-900/20'
                }`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${isCompleted
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    : expired
                      ? 'bg-slate-800 text-slate-500'
                      : 'bg-slate-800 text-slate-400 group-hover:bg-teal-500 group-hover:text-white'
                    }`}>
                    {isCompleted ? <CheckCircle className="h-6 w-6" /> : expired ? <LogOut className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border ${isCompleted
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : expired
                      ? 'bg-red-500/10 text-red-400 border-red-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                    {isCompleted ? 'Completed' : expired ? 'Expired' : 'Pending'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-teal-400 transition-colors">{test.title}</h3>

                <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-6 uppercase tracking-wide">
                  <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5" /> {test.timeMinutes}m</span>
                  <span className="flex items-center"><BookOpen className="w-3.5 h-3.5 mr-1.5" /> {test.questions?.length || 0} Qs</span>
                </div>

                <div className="mt-auto">
                  {isCompleted ? (
                    <div className="w-full bg-slate-900 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                      <span className="text-xs text-slate-500 uppercase font-bold">Score</span>
                      <span className={`text-lg font-bold ${percentage >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {percentage}%
                      </span>
                    </div>
                  ) : expired ? (
                    <button
                      disabled
                      className="w-full py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl font-bold cursor-not-allowed"
                    >
                      Course Expired
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/test/${test.id}`)}
                      className="w-full py-3 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-teal-500 hover:border-teal-500 hover:text-white transition-all shadow-lg active:scale-95"
                    >
                      Start Test
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


const BrowseCoursesTab = ({ user }: { user: User }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await api.getCourses();
      setCourses(data);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white font-heading">Browse Courses</h2>
        <p className="text-slate-400">Explore and enroll in new learning programs.</p>
      </div>

      {loading ? (
        <div className="text-slate-500">Loading courses...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => {
            const isEnrolled = user.enrolledCourses.includes(course.id);
            return (
              <div key={course.id} className="glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-teal-500/30 transition-all group flex flex-col">
                {/* Decorative Header */}
                <div className={`h-32 bg-gradient-to-r ${course.color || 'from-slate-800 to-slate-700'} relative p-6 flex items-end`}>
                  <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                    {course.category}
                  </div>
                  <h3 className="text-xl font-bold text-white shadow-black drop-shadow-md">{course.title}</h3>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-sm text-slate-400 mb-6 line-clamp-3">{course.description}</p>

                  <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mb-6 uppercase tracking-wider">
                    <span>{course.duration}</span>
                    <span>•</span>
                    <span>{course.students} Students</span>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="text-lg font-bold text-white">₹{course.price}</div>
                    {isEnrolled ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1 text-sm">
                        <CheckCircle className="w-4 h-4" /> Enrolled
                      </span>
                    ) : (
                      <button
                        onClick={() => navigate('/payment?courseId=' + course.id)}
                        className="px-4 py-2 bg-white text-slate-900 font-bold rounded-lg hover:bg-teal-500 hover:text-white transition-colors text-sm"
                      >
                        Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


const AnalyticsTab = ({ results }: { results: TestResult[] }) => {
  const chartData = results.length > 0
    ? results.map((r, i) => ({
      name: `T${i + 1}`,
      fullName: `Test ${i + 1}`,
      score: Math.round((r.score / r.totalQuestions) * 100),
      passing: 70
    }))
    : [{ name: 'No Data', score: 0, passing: 70 }];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white font-heading">Performance Analytics</h2>
          <p className="text-slate-400 text-sm mt-1">Detailed insights into your exam performance over time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-card p-4 md:p-8 rounded-2xl border border-white/10 shadow-xl">
          <h3 className="font-bold text-white mb-8 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-teal-400" /> Score Progression (%)
          </h3>
          <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" domain={[0, 100]} fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#2dd4bf' }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '0.5rem' }}
                />
                <Area type="monotone" dataKey="score" stroke="#2dd4bf" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Card */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col gap-6">
          <h3 className="font-bold text-white flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-indigo-400" /> Summary
          </h3>

          <div className="space-y-4">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Tests Taken</p>
              <p className="text-2xl font-bold text-white">{results.length}</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Highest Score</p>
              <p className="text-2xl font-bold text-emerald-400">
                {results.length > 0 ? Math.max(...results.map(r => Math.round((r.score / r.totalQuestions) * 100))) : 0}%
              </p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Lowest Score</p>
              <p className="text-2xl font-bold text-rose-400">
                {results.length > 0 ? Math.min(...results.map(r => Math.round((r.score / r.totalQuestions) * 100))) : 0}%
              </p>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-white/10">
            <p className="text-xs text-slate-500 text-center">Data is based on your completed test submissions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
