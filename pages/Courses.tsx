import React from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Course } from '../types';
import { Star, Clock, Users, ArrowRight, GraduationCap, Microscope, Briefcase, FileCheck, Book } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { useState, useEffect } from 'react';

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'graduation': return <GraduationCap className="h-12 w-12 text-white" />;
    case 'microscope': return <Microscope className="h-12 w-12 text-white" />;
    case 'briefcase': return <Briefcase className="h-12 w-12 text-white" />;
    case 'certificate': return <FileCheck className="h-12 w-12 text-white" />;
    default: return <Book className="h-12 w-12 text-white" />;
  }
};

export const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await api.getCourses();
        setCourses(data);
      } catch (e) {
        console.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="py-20 bg-slate-950 min-h-screen relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-900/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">All Courses</h1>
            <p className="text-slate-400 text-lg">Choose the perfect course for your pharmacy career goals.</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, idx) => (
            <Reveal key={course.id} delay={idx * 100}>
              <div
                className="glass-card rounded-2xl overflow-hidden hover:border-teal-500/30 transition-all duration-500 flex flex-col group hover:-translate-y-2 h-full hover:shadow-2xl hover:shadow-black/50"
              >
                {/* Icon Header */}
                <div className={`h-48 relative overflow-hidden bg-gradient-to-br ${course.color} flex items-center justify-center group-hover:scale-105 transition-transform duration-700`}>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>

                  <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl">
                    {getIcon(course.icon)}
                  </div>

                  <div className="absolute top-4 left-4 z-20 bg-black/40 backdrop-blur text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">
                    {course.category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col bg-gradient-to-b from-slate-900 to-transparent">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white leading-snug line-clamp-2 group-hover:text-teal-400 transition-colors">{course.title}</h3>
                  </div>

                  <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">{course.description}</p>

                  <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-6 uppercase tracking-wide">
                    <span className="flex items-center text-yellow-500"><Star className="h-3 w-3 fill-current mr-1" /> {course.rating}</span>
                    <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {course.duration}</span>
                    <span className="flex items-center"><Users className="h-3 w-3 mr-1" /> {course.students}</span>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-5 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-white">₹{course.price}</span>
                      {course.originalPrice && <span className="text-xs text-slate-500 line-through">₹{course.originalPrice}</span>}
                    </div>
                    <button
                      onClick={() => navigate(`/courses/${course.id}`)}
                      className="px-6 py-2.5 bg-white text-slate-950 rounded-lg font-bold text-sm hover:bg-teal-400 transition-colors flex items-center gap-2 group-hover:pl-4 group-hover:pr-8 relative overflow-hidden transition-all"
                    >
                      Details <ArrowRight className="w-4 h-4 absolute right-3 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
};