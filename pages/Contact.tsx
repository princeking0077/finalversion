import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

export const Contact = () => {
  return (
    <div className="py-20 bg-slate-950 min-h-screen relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-slide-up">
             <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Get in Touch</h1>
             <p className="text-slate-400 text-lg">Have questions about our courses? We're here to help.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
             {/* Contact Info */}
             <div className="space-y-8 animate-slide-up delay-100">
                <div className="glass-card p-8 rounded-2xl">
                   <h3 className="text-xl font-bold text-white mb-8">Contact Information</h3>
                   <div className="space-y-8">
                      <div className="flex items-start group">
                         <div className="bg-teal-500/10 border border-teal-500/20 p-4 rounded-xl mr-5 group-hover:bg-teal-500/20 transition-colors">
                            <MapPin className="h-6 w-6 text-teal-400" />
                         </div>
                         <div>
                            <p className="text-sm text-slate-400 font-medium mb-1 uppercase tracking-wider">Our Location</p>
                            <p className="text-white text-lg leading-snug">{CONTACT_INFO.address}</p>
                         </div>
                      </div>
                      <div className="flex items-center group">
                         <div className="bg-teal-500/10 border border-teal-500/20 p-4 rounded-xl mr-5 group-hover:bg-teal-500/20 transition-colors">
                            <Phone className="h-6 w-6 text-teal-400" />
                         </div>
                         <div>
                            <p className="text-sm text-slate-400 font-medium mb-1 uppercase tracking-wider">Phone Number</p>
                            <p className="text-white text-lg">{CONTACT_INFO.phone}</p>
                         </div>
                      </div>
                      <div className="flex items-center group">
                         <div className="bg-teal-500/10 border border-teal-500/20 p-4 rounded-xl mr-5 group-hover:bg-teal-500/20 transition-colors">
                            <Mail className="h-6 w-6 text-teal-400" />
                         </div>
                         <div>
                            <p className="text-sm text-slate-400 font-medium mb-1 uppercase tracking-wider">Email Address</p>
                            <p className="text-white text-lg">{CONTACT_INFO.email}</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Map Placeholder */}
                <div className="h-64 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center text-slate-500 border border-white/5 relative group">
                    <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] opacity-10 bg-cover bg-center"></div>
                    <span className="relative z-10 group-hover:text-white transition-colors">Map Integration Placeholder</span>
                </div>
             </div>

             {/* Form */}
             <div className="glass-card p-8 md:p-10 rounded-2xl animate-slide-up delay-200 border-t border-white/10">
                <h3 className="text-2xl font-bold text-white mb-8">Send Message</h3>
                <form className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                         <input type="text" className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition text-white placeholder-slate-600" placeholder="Your Name" />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                         <input type="email" className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition text-white placeholder-slate-600" placeholder="your@email.com" />
                      </div>
                   </div>
                   <div>
                       <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                       <input type="text" className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition text-white placeholder-slate-600" placeholder="Course Inquiry" />
                   </div>
                   <div>
                       <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                       <textarea rows={4} className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition text-white placeholder-slate-600" placeholder="How can we help you?"></textarea>
                   </div>
                   <button type="button" className="w-full bg-teal-500 text-white font-bold py-4 rounded-xl hover:bg-teal-400 transition flex items-center justify-center shadow-lg shadow-teal-500/20">
                      <Send className="h-5 w-5 mr-2" /> Send Message
                   </button>
                </form>
             </div>
          </div>
       </div>
    </div>
  );
};