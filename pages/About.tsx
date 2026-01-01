import React from 'react';
import { CheckCircle, Award, Users } from 'lucide-react';

export const About = () => {
  return (
    <div className="py-20 bg-slate-950 min-h-screen relative overflow-hidden">
       {/* Ambient Light */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About Enlighten Pharma</h1>
          <div className="h-1 w-24 bg-teal-500 mx-auto rounded-full shadow-[0_0_15px_rgba(20,184,166,0.5)]"></div>
        </div>

        <div className="prose prose-lg prose-invert mx-auto mb-16 text-center animate-slide-up delay-100">
          <p className="lead text-2xl text-white font-medium mb-6">
            India’s leading platform for pharmacy exam preparation.
          </p>
          <p className="text-slate-400">
            We specialize in GPAT, NIPER, DPEE, MPSC Drug Inspector, and various national/state-level competitive exams.
            With expert faculties, structured test series, and live interactive classes, we aim to empower pharmacy students to achieve academic and professional excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center animate-slide-up delay-200">
           <div className="p-8 glass-card rounded-2xl hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-400">
                 <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Expert Faculty</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Learn from toppers and industry experts with years of teaching experience.</p>
           </div>
           <div className="p-8 glass-card rounded-2xl hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-400">
                 <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Proven Results</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Consistently producing top rankers in GPAT and NIPER exams.</p>
           </div>
           <div className="p-8 glass-card rounded-2xl hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-400">
                 <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Comprehensive Material</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Detailed study notes, question banks, and mock tests covering the entire syllabus.</p>
           </div>
        </div>
      </div>
    </div>
  );
};