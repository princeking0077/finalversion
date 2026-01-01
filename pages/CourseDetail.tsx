import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { COURSES } from '../constants';
import { Clock, Star, Users, Award, PlayCircle, CheckCircle, Share2, GraduationCap, Microscope, Briefcase, FileCheck, Book, ExternalLink } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { api } from '../utils/api';

const getIcon = (iconName: string) => {
    switch (iconName) {
        case 'graduation': return <GraduationCap className="h-24 w-24 text-white opacity-80" />;
        case 'microscope': return <Microscope className="h-24 w-24 text-white opacity-80" />;
        case 'briefcase': return <Briefcase className="h-24 w-24 text-white opacity-80" />;
        case 'certificate': return <FileCheck className="h-24 w-24 text-white opacity-80" />;
        default: return <Book className="h-24 w-24 text-white opacity-80" />;
    }
};


export const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'reviews'>('overview');

    useEffect(() => {
        const fetchCourse = async () => {
            // Check static constants first
            const staticCourse = COURSES.find(c => c.id === id);
            if (staticCourse) {
                setCourse(staticCourse);
                setLoading(false);
                return;
            }

            // Check dynamic API courses
            try {
                const allCourses = await api.getCourses();
                const found = allCourses.find((c: any) => c.id === id);
                if (found) setCourse(found);
            } catch (e) {
                console.error("Error fetching course", e);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
                <h2 className="text-2xl font-bold mb-4">Course not found</h2>
                <button onClick={() => navigate('/courses')} className="text-teal-400 hover:text-teal-300 underline">Back to courses</button>
            </div>
        );
    }

    const handleEnroll = () => {
        const user = localStorage.getItem('epa_user');
        if (user) {
            navigate(`/payment?courseId=${course.id}`);
        } else {
            navigate('/register');
        }
    };

    return (
        <div className="bg-slate-950 min-h-screen pb-12 animate-fade-in">
            {/* Course Header */}
            <div className={`relative overflow-hidden py-20 md:py-28 border-b border-white/5`}>
                {/* Dynamic Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-20`}></div>
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-3xl"></div>
                <div className="absolute -right-20 -top-20 opacity-10 transform rotate-12 pointer-events-none">
                    {getIcon(course.icon)}
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                        <div className="lg:col-span-2">
                            <Reveal>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wider uppercase">{course.category}</span>
                                    <div className="flex items-center text-yellow-400 text-sm font-medium">
                                        <Star className="h-4 w-4 fill-current mr-1" />
                                        {course.rating} Rating
                                    </div>
                                </div>
                            </Reveal>

                            <Reveal delay={100}>
                                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight leading-tight">{course.title}</h1>
                            </Reveal>

                            <Reveal delay={200}>
                                <p className="text-slate-300 text-lg mb-8 leading-relaxed max-w-2xl">{course.description}</p>
                            </Reveal>

                            <Reveal delay={300}>
                                <div className="flex flex-wrap gap-8 text-sm text-slate-400">
                                    <span className="flex items-center"><Clock className="h-5 w-5 mr-2 text-teal-500" /> {course.duration} Content</span>
                                    <span className="flex items-center"><Users className="h-5 w-5 mr-2 text-teal-500" /> {course.students} Enrolled</span>
                                    <span className="flex items-center"><Award className="h-5 w-5 mr-2 text-teal-500" /> Certificate</span>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <Reveal delay={400}>
                            <div className="glass-card rounded-2xl overflow-hidden">
                                <div className="flex border-b border-white/5 bg-slate-900/50">
                                    {['overview', 'curriculum', 'reviews'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab as any)}
                                            className={`flex-1 py-4 text-center font-medium text-sm capitalize transition-all relative ${activeTab === tab ? 'text-teal-400' : 'text-slate-400 hover:text-white'
                                                }`}
                                        >
                                            {tab}
                                            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>}
                                        </button>
                                    ))}
                                </div>

                                <div className="p-8">
                                    {activeTab === 'overview' && (
                                        <div className="space-y-8 animate-fade-in">
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-4">Course Highlights</h3>
                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {['Live Interactive Classes', 'Recorded Lectures (HD)', 'Subject-wise Test Series', 'Study Material (PDFs)', 'Doubt Solving Sessions', 'Previous Year Papers'].map((item, idx) => (
                                                        <li key={idx} className="flex items-start bg-white/5 p-3 rounded-lg border border-white/5">
                                                            <CheckCircle className="h-5 w-5 text-teal-500 mr-3 shrink-0" />
                                                            <span className="text-slate-300 text-sm">{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="bg-indigo-500/10 p-6 rounded-2xl border border-indigo-500/20">
                                                <h4 className="font-bold text-indigo-300 mb-3 text-lg">Description</h4>
                                                <p className="text-slate-300 leading-relaxed">
                                                    This comprehensive course is designed to take you from basics to advanced concepts required for {course.title}.
                                                    Taught by industry experts with years of experience in pharmacy education, you will gain the confidence needed to crack the exam with top ranks.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'curriculum' && (
                                        <div className="space-y-4 animate-fade-in">
                                            <h3 className="text-xl font-bold text-white mb-4">Syllabus Structure</h3>
                                            {[1, 2, 3, 4, 5].map((module) => (
                                                <div key={module} className="border border-white/10 bg-white/5 rounded-xl p-5 hover:border-teal-500/30 transition-colors group">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <h4 className="font-bold text-white group-hover:text-teal-400 transition-colors">Module {module}: Core Concepts Part {module}</h4>
                                                        <span className="text-xs text-slate-500 font-mono bg-black/30 px-2 py-1 rounded">5 Lessons</span>
                                                    </div>
                                                    <div className="space-y-3 pl-4 border-l border-white/10">
                                                        <div className="flex items-center text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">
                                                            <PlayCircle className="h-4 w-4 mr-3 text-teal-500" /> Introduction & Basics
                                                        </div>
                                                        <div className="flex items-center text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">
                                                            <PlayCircle className="h-4 w-4 mr-3 text-teal-500" /> Advanced Theories
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {activeTab === 'reviews' && (
                                        <div className="text-center py-10 animate-fade-in">
                                            <div className="flex justify-center items-center mb-6">
                                                <span className="text-6xl font-bold text-white mr-6">{course.rating}</span>
                                                <div className="text-left">
                                                    <div className="flex text-yellow-500 mb-1"><Star className="fill-current h-5 w-5" /><Star className="fill-current h-5 w-5" /><Star className="fill-current h-5 w-5" /><Star className="fill-current h-5 w-5" /><Star className="fill-current h-5 w-5" /></div>
                                                    <span className="text-sm text-slate-500">Based on {course.students} ratings</span>
                                                </div>
                                            </div>
                                            <p className="text-slate-300 italic text-lg max-w-lg mx-auto">"Best course for GPAT preparation. The test series is very helpful!" <br /><span className="text-teal-400 not-italic text-sm font-bold mt-2 block">- Rahul S.</span></p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    {/* Sidebar Card (Sticky) */}
                    <div className="lg:col-span-1">
                        <Reveal delay={500}>
                            <div className="glass-card rounded-2xl p-6 sticky top-24 border border-teal-500/20 shadow-xl shadow-black/50 bg-slate-900/80 backdrop-blur-xl">
                                <div className="mb-6">
                                    <div className="flex items-end mb-2">
                                        <span className="text-4xl font-bold text-white mr-3">₹{course.price}</span>
                                        {course.originalPrice && <span className="text-lg text-slate-500 line-through mb-1.5">₹{course.originalPrice}</span>}
                                    </div>
                                    <p className="text-sm text-rose-400 font-medium flex items-center bg-rose-500/10 py-1 px-2 rounded w-fit"><Clock className="h-3.5 w-3.5 mr-1.5" /> Offer ends soon!</p>
                                </div>

                                <div className="space-y-3 mb-8">
                                    <button onClick={handleEnroll} className="w-full bg-teal-500 text-white font-bold py-3.5 rounded-xl hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transform hover:scale-[1.02] flex justify-center items-center gap-2">
                                        Enroll Now <ExternalLink className="h-4 w-4" />
                                    </button>
                                    <button className="w-full bg-transparent text-white border border-white/20 font-bold py-3.5 rounded-xl hover:bg-white/5 transition-colors">
                                        Download Brochure
                                    </button>
                                </div>

                                <div className="space-y-4 text-sm text-slate-400 pt-6 border-t border-white/10">
                                    <div className="flex justify-between">
                                        <span>Language</span>
                                        <span className="font-medium text-white">English / Hindi</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Access</span>
                                        <span className="font-medium text-white">Lifetime</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Support</span>
                                        <span className="font-medium text-white">24/7 Doubt Solving</span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-white/10 text-center">
                                    <button className="text-slate-500 hover:text-white flex items-center justify-center w-full transition-colors">
                                        <Share2 className="h-4 w-4 mr-2" /> Share this course
                                    </button>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </div>
    );
};