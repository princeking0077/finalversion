// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Course } from '../types';
import { COURSES } from '../constants';
import { GraduationCap, BookOpen, Users, Award, TrendingUp, CheckCircle, Star, ArrowRight, Sparkles, Target, Clock, Shield, Zap, Trophy, Video, FileText } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>(COURSES);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await api.getCourses();
        if (data && data.length > 0) setCourses(data);
      } catch (e) {
        console.error('fetch courses error', e);
      }
    };
    fetch();
  }, []);

  const features = [
    {
      icon: GraduationCap,
      title: 'Expert Faculty',
      description: 'Learn from industry professionals with years of experience in pharmaceutical education'
    },
    {
      icon: BookOpen,
      title: 'Comprehensive Curriculum',
      description: 'Updated course content aligned with latest GPAT and NIPER exam patterns'
    },
    {
      icon: Users,
      title: 'Interactive Learning',
      description: 'Engage with peers and mentors through live sessions and discussion forums'
    },
    {
      icon: Award,
      title: 'Certification',
      description: 'Receive recognized certificates upon successful course completion'
    }
  ];

  const stats = [
    { icon: Users, value: '5000+', label: 'Students Enrolled' },
    { icon: BookOpen, value: '50+', label: 'Expert Courses' },
    { icon: Award, value: '95%', label: 'Success Rate' },
    { icon: Star, value: '4.8/5', label: 'Average Rating' }
  ];

  const benefits = [
    'Flexible learning schedule',
    'Access to study materials 24/7',
    'Regular mock tests and assessments',
    'Personalized doubt clearing sessions',
    'Performance tracking and analytics',
    'Mobile-friendly platform'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-indigo-500/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Empowering Future
              <span className="block bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">
                Pharmacists
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Master pharmaceutical sciences with expert guidance and comprehensive courses designed for GPAT, NIPER, and other competitive exams
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/courses')}
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-200 shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2"
              >
                Explore Courses
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20"
              >
                Sign Up Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/5 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-teal-500/20 to-indigo-500/20 rounded-xl">
                    <stat.icon className="h-8 w-8 text-teal-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Why Choose Enlighten Pharma Academy?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Experience excellence in pharmaceutical education with our comprehensive learning platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="p-3 bg-gradient-to-br from-teal-500/20 to-indigo-500/20 rounded-xl w-fit mb-4">
                  <feature.icon className="h-8 w-8 text-teal-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Our platform provides all the tools and resources necessary for your pharmaceutical exam preparation journey
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-teal-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-200">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-indigo-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                    <TrendingUp className="h-10 w-10 text-teal-400" />
                    <div>
                      <div className="font-semibold text-white">Track Your Progress</div>
                      <div className="text-sm text-slate-400">Real-time performance analytics</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                    <BookOpen className="h-10 w-10 text-indigo-400" />
                    <div>
                      <div className="font-semibold text-white">Rich Study Materials</div>
                      <div className="text-sm text-slate-400">Videos, notes, and practice tests</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                    <Users className="h-10 w-10 text-purple-400" />
                    <div>
                      <div className="font-semibold text-white">Expert Mentorship</div>
                      <div className="text-sm text-slate-400">One-on-one guidance available</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 rounded-full border border-teal-500/20 mb-4">
              <Sparkles className="h-4 w-4 text-teal-400" />
              <span className="text-teal-400 font-semibold text-sm">Simple Process</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Your journey to pharmaceutical excellence starts here
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Users,
                title: 'Sign Up & Enroll',
                description: 'Create your account and choose from our comprehensive range of pharmaceutical courses',
                color: 'from-teal-500 to-emerald-500'
              },
              {
                step: '02',
                icon: Video,
                title: 'Learn & Practice',
                description: 'Access video lectures, study materials, and take regular mock tests to strengthen your knowledge',
                color: 'from-indigo-500 to-purple-500'
              },
              {
                step: '03',
                icon: Trophy,
                title: 'Excel & Achieve',
                description: 'Track your progress with detailed analytics and ace your GPAT, NIPER, or other competitive exams',
                color: 'from-orange-500 to-pink-500'
              }
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
                <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:-translate-y-2">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute top-8 right-8 text-6xl font-bold text-white/5">{item.step}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              What Students Say
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Success stories from our pharmaceutical community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya Sharma',
                role: 'GPAT 2025 Qualifier',
                image: 'PS',
                content: 'The structured courses and regular mock tests helped me crack GPAT with a great rank. Highly recommended!',
                rating: 5
              },
              {
                name: 'Rahul Verma',
                role: 'B.Pharm Student',
                image: 'RV',
                content: 'Expert faculty and comprehensive study materials made my preparation journey smooth and effective.',
                rating: 5
              },
              {
                name: 'Anjali Patel',
                role: 'NIPER Aspirant',
                image: 'AP',
                content: 'The analytics feature helped me identify my weak areas and improve consistently. Best investment!',
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-200 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-indigo-500 opacity-90"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative px-8 py-16 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full border border-white/30 mb-6">
                <Zap className="h-4 w-4 text-white" />
                <span className="text-white font-semibold text-sm">Limited Time Offer</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of students who are already preparing for their pharmaceutical careers
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-slate-100 transition-all duration-200 shadow-lg flex items-center justify-center gap-2 group"
                >
                  Get Started Now
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/courses')}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 border border-white/30"
                >
                  Browse Courses
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
