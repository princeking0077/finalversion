import React from 'react';
import { useParams } from 'react-router-dom';

export const Legal = () => {
  const { policy } = useParams();

  let title = "Legal Policy";
  let content = "Content loading...";

  switch(policy) {
    case 'privacy':
      title = "Privacy Policy";
      content = "We value your privacy. This policy outlines how we collect, use, and protect your personal information according to the IT Act, India. We do not sell your data to third parties.";
      break;
    case 'terms':
      title = "Terms & Conditions";
      content = "By accessing Enlighten Pharma Academy, you agree to abide by these terms. Course materials are for personal use only and strictly prohibited from distribution.";
      break;
    case 'refund':
      title = "Refund & Cancellation Policy";
      content = "We follow a no-refund policy once a course is purchased, as all study materials and content are instantly accessible after enrollment. Please check the course details carefully before buying.";
      break;
    default:
      content = "Page not found.";
  }

  return (
    <div className="py-20 bg-slate-950 min-h-[70vh] flex items-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full animate-fade-in">
        <div className="glass-card p-8 md:p-12 rounded-2xl border border-white/5">
            <h1 className="text-3xl font-bold text-white mb-8 pb-4 border-b border-white/10">{title}</h1>
            <div className="prose prose-lg prose-invert text-slate-400">
            <p className="leading-relaxed">{content}</p>
            <p className="mt-8 p-4 bg-teal-500/10 border border-teal-500/20 rounded-xl text-sm">
                For further queries, please contact us at: <br/>
                <strong className="text-teal-400">enlightenpharmaacademy@gmail.com</strong>
            </p>
            </div>
        </div>
      </div>
    </div>
  );
};