// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Course } from '../types';
import { COURSES } from '../constants';
import { GraduationCap, BookOpen, Users, Award, TrendingUp, CheckCircle, Star, ArrowRight } from 'lucide-react';

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

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-indigo-500 opacity-90"></div>
            <div className="relative px-8 py-16 text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of students who are already preparing for their pharmaceutical careers
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-slate-100 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                >
                  Get Started Now
                  <ArrowRight className="h-5 w-5" />
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
