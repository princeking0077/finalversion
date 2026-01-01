
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Clock, Star, Users, CheckCircle, Book, ArrowRight, GraduationCap, Microscope, Briefcase, FileCheck, FlaskConical, PlayCircle, Shield } from 'lucide-react';
import { COURSES, FAQS } from '../constants';
import { Reveal } from '../components/Reveal';

// Icon mapping helper
const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'graduation': return <GraduationCap className="h-12 w-12 text-white" />;
    case 'microscope': return <Microscope className="h-12 w-12 text-white" />;
    case 'briefcase': return <Briefcase className="h-12 w-12 text-white" />;
    case 'certificate': return <FileCheck className="h-12 w-12 text-white" />;
    default: return <Book className="h-12 w-12 text-white" />;
  }
};

export const Home = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-10 lg:pt-0">
        {/* Background Gradients with Parallax */}
        <div
          className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse-slow"
          style={{ transform: `translate3d(-50%, ${scrollY * 0.5}px, 0)` }}
        ></div>
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"
          style={{ transform: `translate3d(0, ${scrollY * 0.2}px, 0)` }}
        ></div>

        {/* Floating Elements (Decorative) */}
        <div className="absolute top-32 left-10 md:left-32 animate-float opacity-30 pointer-events-none hidden md:block">
          <FlaskConical className="h-16 w-16 text-teal-400" />
        </div>
        <div className="absolute bottom-32 right-10 md:right-32 animate-float-delayed opacity-30 pointer-events-none hidden md:block">
          <Microscope className="h-20 w-20 text-indigo-400" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col items-center text-center">
            <Reveal delay={0} width="fit-content">
              <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900/40 border border-teal-500/20 backdrop-blur-xl mb-8 hover:bg-slate-800/60 transition-all duration-300 cursor-default shadow-[0_0_20px_rgba(20,184,166,0.1)] hover:shadow-[0_0_30px_rgba(20,184,166,0.2)] group border-l-4 border-l-teal-500">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
                </span>
                <span className="text-sm font-bold text-teal-100 tracking-wide group-hover:text-teal-400 transition-colors">Admissions Open for GPAT 2026</span>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 leading-[1.1] font-heading">
                Your Journey <br />
                <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-indigo-400 text-transparent bg-clip-text">Begins Here.</span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                Master Pharmacy concepts with expert-led courses. Prepare for GPAT, NIPER, and DI exams with India's most advanced learning platform.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto justify-center">
                <button
                  onClick={() => navigate('/courses')}
                  className="px-8 py-4 bg-white text-slate-950 font-bold rounded-full hover:bg-teal-50 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(20,184,166,0.4)] hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 group"
                >
                  Browse Courses <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 glass text-white font-bold rounded-full hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Student Login <PlayCircle className="w-4 h-4" />
                </button>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 text-center w-full max-w-6xl border-t border-white/5 pt-12">
                {[
                  { label: "Active Students", value: "2,000+" },
                  { label: "Video Lectures", value: "500+" },
                  { label: "Mock Tests", value: "100+" },
                  { label: "Expert Tutors", value: "15+" },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center group">
                    <p className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-teal-400 transition-colors font-heading">{stat.value}</p>
                    <p className="text-xs md:text-sm text-slate-500 uppercase tracking-[0.2em] font-bold">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading">Featured Categories</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">Explore specialized categories designed for every step of your career.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "National Level Exams", exams: "GPAT, NIPER", desc: "For PG admission preparation", icon: <GraduationCap className="h-8 w-8" />, color: "from-purple-500/20 to-indigo-500/20" },
              { title: "State-Level Exams", exams: "MPSC Drug Inspector, FDA", desc: "Maharashtra State government jobs", icon: <Briefcase className="h-8 w-8" />, color: "from-blue-500/20 to-sky-500/20" },
              { title: "Govt Job Preparation", exams: "Pharmacist (Railways, ESIC)", desc: "Job-oriented test prep", icon: <Shield className="h-8 w-8" />, color: "from-emerald-500/20 to-teal-500/20" },
              { title: "Pharmacy Exit Exams", exams: "DPEE", desc: "Exit certification for Diploma holders", icon: <FileCheck className="h-8 w-8" />, color: "from-orange-500/20 to-amber-500/20" },
              { title: "University Support", exams: "B.Pharm & D.Pharm", desc: "Semester-wise learning aid", icon: <Book className="h-8 w-8" />, color: "from-rose-500/20 to-pink-500/20" }
            ].map((cat, idx) => (
              <Reveal key={idx} delay={idx * 100}>
                <div
                  className="glass-card rounded-3xl p-8 hover:bg-slate-800/90 transition-all duration-500 group cursor-pointer hover:-translate-y-3 h-full border border-white/5 hover:border-teal-500/50 relative overflow-hidden shadow-lg hover:shadow-teal-900/30"
                >
                  <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${cat.color} blur-[80px] rounded-full pointer-events-none opacity-20 group-hover:opacity-100 transition-opacity duration-700`}></div>
                  <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-teal-500/10 blur-[60px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                  <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 border border-white/10 shadow-xl relative z-10 group-hover:border-teal-500/30">
                    <div className="text-teal-400 group-hover:text-white transition-colors duration-500 child-svg:drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]">
                      {cat.icon}
                    </div>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">{cat.title}</h3>
                    <p className="text-xs font-bold text-teal-400 mb-4 uppercase tracking-wide bg-teal-950/40 px-3 py-1.5 rounded-lg border border-teal-500/10 w-fit">{cat.exams}</p>
                    <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">{cat.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-24 relative bg-slate-900/30">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-heading">Popular Courses</h2>
                <p className="text-slate-400 text-lg">Explore our most enrolled and high-rated pharmacy learning programs.</p>
              </div>
              <button
                onClick={() => navigate('/courses')}
                className="text-white hover:text-teal-400 font-medium flex items-center gap-2 group transition-all px-6 py-3 rounded-full border border-white/10 hover:border-teal-500/50 hover:bg-teal-500/10"
              >
                View All Courses <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {COURSES.map((course, idx) => (
              <Reveal key={course.id} delay={idx * 100}>
                <div className="glass-card rounded-2xl overflow-hidden hover:border-teal-500/40 transition-all duration-500 group flex flex-col h-full hover:shadow-2xl hover:shadow-teal-900/20">
                  {/* Icon Header */}
                  <div className={`h-48 relative overflow-hidden bg-gradient-to-br ${course.color} flex items-center justify-center group-hover:scale-105 transition-transform duration-700`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 to-transparent"></div>

                    {/* Main Icon */}
                    <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl">
                      {getIcon(course.icon)}
                    </div>

                    <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md text-yellow-400 text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 flex items-center shadow-lg">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400" /> {course.rating}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col bg-slate-900/80 backdrop-blur-sm -mt-10 relative z-20 rounded-t-2xl border-t border-white/5 mx-2 shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
                    <div className="mb-4">
                      <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest bg-teal-950/50 px-2 py-1 rounded border border-teal-500/20">{course.category}</span>
                      <h3 className="font-bold text-lg text-white mt-3 line-clamp-2 leading-snug group-hover:text-teal-400 transition-colors">{course.title}</h3>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 mb-6 border-b border-white/5 pb-4">
                      <span className="flex items-center"><Clock className="h-3.5 w-3.5 mr-1.5 text-slate-500" /> {course.duration}</span>
                      <span className="flex items-center"><Users className="h-3.5 w-3.5 mr-1.5 text-slate-500" /> {course.students}</span>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-white">₹{course.price}</span>
                        {course.originalPrice && (
                          <span className="text-xs text-slate-500 line-through ml-2">₹{course.originalPrice}</span>
                        )}
                      </div>
                      <button
                        onClick={() => navigate(`/courses/${course.id}`)}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-teal-500 hover:border-teal-500 transition-all duration-300 group-hover:rotate-[-45deg]"
                      >
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-heading">Frequently Asked Questions</h2>
              <p className="text-slate-400">Everything you need to know about our platform.</p>
            </div>
          </Reveal>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <Reveal key={idx} delay={idx * 50}>
                <details className="group glass-card rounded-xl border border-white/5 [&[open]]:border-teal-500/30 [&[open]]:bg-slate-800/80 transition-all duration-300">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-slate-200 hover:text-white transition-colors select-none">
                    <span className="text-lg font-heading">{faq.question}</span>
                    <span className="bg-white/5 rounded-full p-2 transition-transform duration-300 group-open:rotate-180 group-hover:bg-white/10">
                      <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-white" />
                    </span>
                  </summary>
                  <div className="text-slate-400 p-6 pt-0 leading-relaxed border-t border-transparent group-open:border-white/5 animate-fadeIn">
                    {faq.answer}
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-teal-900/20 to-slate-950"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <Reveal>
          <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 font-heading">Ready to start your journey?</h2>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">Join thousands of students achieving their dreams with Enlighten Pharma Academy today.</p>
            <button
              onClick={() => navigate('/login')}
              className="px-12 py-5 bg-teal-500 hover:bg-teal-400 text-white font-bold text-lg rounded-full shadow-[0_0_30px_rgba(20,184,166,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(20,184,166,0.6)]"
            >
              Get Started Now
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  );
};
