// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, Course } from '../utils/api';
import { GraduationCap, BookOpen, Users, Award, TrendingUp, CheckCircle, Star, ArrowRight, Sparkles, Zap, Trophy, Video, ShieldCheck, MapPin } from 'lucide-react';
import { COURSES as STATIC_COURSES } from '../constants'; // Fallback

export const Home = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await api.getCourses();
        // Fallback to static if API returns empty array (e.g. init db)
        setCourses(data.length > 0 ? data : STATIC_COURSES);
      } catch (e) {
        console.error('Failed to load courses', e);
        setCourses(STATIC_COURSES);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const features = [
    { icon: GraduationCap, title: 'Expert Faculty', desc: 'Succeed with guidance from top pharmaceutical educators.' },
    { icon: BookOpen, title: 'Comprehensive Material', desc: 'Resources aligned with latest GPAT & NIPER patterns.' },
    { icon: Users, title: 'Live Mentorship', desc: 'Interactive sessions to clear doubts instantly.' },
    { icon: Award, title: 'Certified Success', desc: 'Join thousands of students achieving their dreams.' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-teal-500/30">

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-8 animate-fade-in-up">
              <Sparkles className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-medium text-slate-200">India's #1 Pharma Entrance Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Master Your <br />
              <span className="bg-gradient-to-r from-teal-400 via-indigo-400 to-purple-400 text-transparent bg-clip-text">Pharma Career</span>
            </h1>

            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Comprehensive preparation for GPAT, NIPER, and Drug Inspector exams with expert-curated courses and real-time analytics.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <button
                onClick={() => navigate('/courses')}
                className="group relative px-8 py-4 bg-teal-500 text-white rounded-xl font-bold overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(20,184,166,0.3)]"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative flex items-center gap-2">
                  Explore Courses <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all hover:border-white/20"
              >
                Start Free Trial
              </button>
            </div>
          </div>

          {/* Floaters (Decorative) */}
          <div className="hidden lg:block absolute top-20 left-10 animate-float" style={{ animationDuration: '6s' }}>
            <div className="glass-card p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-md">
              <Trophy className="w-8 h-8 text-yellow-400 mb-2" />
              <div className="text-xs font-bold text-slate-300">Top Rankers</div>
              <div className="text-lg font-bold text-white">500+</div>
            </div>
          </div>
          <div className="hidden lg:block absolute bottom-20 right-10 animate-float" style={{ animationDuration: '7s', animationDelay: '1s' }}>
            <div className="glass-card p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-md">
              <Users className="w-8 h-8 text-teal-400 mb-2" />
              <div className="text-xs font-bold text-slate-300">Active Students</div>
              <div className="text-lg font-bold text-white">10k+</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <div className="border-y border-white/5 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Success Rate', value: '98%', icon: TrendingUp, color: 'text-emerald-400' },
              { label: 'Video Lectures', value: '500+', icon: Video, color: 'text-rose-400' },
              { label: 'Mock Tests', value: '200+', icon: CheckCircle, color: 'text-indigo-400' },
              { label: 'Expert Faculty', value: '50+', icon: GraduationCap, color: 'text-amber-400' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-4 justify-center md:justify-start">
                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Courses */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">Popular Courses</h2>
              <p className="text-slate-400 max-w-xl">Curated learning paths designed by industry experts to ensure your success.</p>
            </div>
            <button onClick={() => navigate('/courses')} className="text-teal-400 font-bold hover:text-teal-300 flex items-center gap-2 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-96 rounded-3xl bg-white/5 animate-pulse"></div>)
            ) : (
              courses.slice(0, 3).map((course) => (
                <div key={course.id} className="group relative bg-slate-900 rounded-3xl border border-white/10 overflow-hidden hover:border-teal-500/50 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-900/20">
                  {/* Decorative Gradient */}
                  <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${course.color || 'from-teal-500 to-emerald-500'}`}></div>

                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 text-slate-300 border border-white/10`}>
                        {course.category}
                      </span>
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-bold text-sm">{course.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-teal-400 transition-colors">{course.title}</h3>
                    <p className="text-slate-400 text-sm mb-6 line-clamp-2">{course.description}</p>

                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-8">
                      <span className="flex items-center gap-1"><Zap className="w-4 h-4" /> {course.students}+ Students</span>
                      <span className="flex items-center gap-1"><Video className="w-4 h-4" /> {course.duration}</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/10 pt-6">
                      <div>
                        <span className="text-xs text-slate-500 block">Course Fee</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-white">₹{course.price}</span>
                          <span className="text-sm text-slate-600 line-through">₹{course.originalPrice}</span>
                        </div>
                      </div>
                      <button onClick={() => navigate(`/courses/${course.id}`)} className="p-3 rounded-xl bg-white/5 hover:bg-teal-500 text-teal-400 hover:text-white transition-all">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-950/80"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">Why Choose Us?</h2>
            <p className="text-slate-400">Experience the difference with our premium educational ecosystem.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-center group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <f.icon className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden p-12 text-center border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-900/40 to-indigo-900/40 backdrop-blur-xl"></div>

            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-6 font-heading">Ready to Start Your Journey?</h2>
              <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                Join the community of top performers and secure your future in pharmacy today.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="px-10 py-5 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-200 transition-colors shadow-xl"
              >
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
