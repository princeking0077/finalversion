
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, User } from '../utils/api';
import { Reveal } from '../components/Reveal';
import { UserPlus, Mail, Lock, User as UserIcon, AlertCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '../components/Toast';
import { Logo } from '../components/Logo';

export const Register = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      addToast("Passwords do not match", 'error');
      return;
    }

    // Check local validation if needed, but backend also checks

    const newUser: User = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: 'student',
      status: 'pending',
      password: formData.password, // Only strictly needed if API expects it in User object
      enrolledCourses: []
    };

    try {
      const res = await api.register(newUser);
      if (res.success) {
        addToast("Registration successful! Proceeding to payment...", 'success');
        // Redirect to payment page with Reg ID if available (backend needs to return it)
        // Since backend update adds registrationId to User object, we might need it back in response
        // Assuming 'res' contains { success: true, message: '...' } - currently it doesn't return user.
        // We will just redirect to payment page, logic there will handle "pending" user if logged in via other means?
        // Wait, 'register' endpoint doesn't login the user.
        // We should probably auto-login or ask to login.
        // For smoother flow: Register -> Auto Login -> Payment.
        // Let's rely on manual login for now OR modify register to return user/token.
        // The backend `auth/register` returns { success: true, message: '...' }.
        // Let's modify frontend to just redirect to Login with a specific param?
        // Or better: Redirect to Payment, but Payment page requires Login.
        // User flow: Register -> Login -> Payment.
        // To make it smoother, we update backend to return token on register or we login immediately.
        // Let's stick to simple: Clean Register -> Redirect to Login (users usually expect verification).
        // BUT user asked for: Registration success -> Redirect to payment page.
        // This implies auto-login.
        // I'll assume for now I can redirect to login with a "registered=true" flag or similar.
        // Actually, looking at the requirement: "Registration success -> Redirect to payment page"
        // I will implement Auto-Login on Register in Client Side (call login after register success).

        await api.login(formData.email, formData.password); // Auto Login
        navigate('/payment');
      } else {
        setError(res.message || "Registration failed");
        addToast(res.message || "Registration failed", 'error');
      }
    } catch (e) {
      setError("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 font-sans">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-indigo-900 items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1633613286991-611fe299c4be?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-purple-900/90"></div>
        <div className="relative z-10 p-12 text-white max-w-lg">
          <div className="mb-8">
            <Logo className="h-10 w-10 mb-6" />
            <h1 className="text-5xl font-bold mb-6 leading-tight">Join the Future of Pharmacy Learning.</h1>
            <p className="text-indigo-200 text-lg leading-relaxed">Access premium courses, expert mentorship, and comprehensive test series designed for GPAT, NIPER, and Drug Inspector exams.</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-12">
            {[
              { label: 'Expert Faculty', val: '15+' },
              { label: 'Success Ratio', val: '98%' },
              { label: 'Active Learners', val: '5k+' },
              { label: 'Mock Tests', val: '500+' }
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                <div className="text-2xl font-bold mb-1">{stat.val}</div>
                <div className="text-xs text-indigo-200 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Animated blobs */}
        <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-indigo-500/30 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-20%] w-[80%] h-[80%] bg-purple-500/30 blur-[120px] rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <div className="absolute top-0 right-0 p-6 hidden lg:block">
          <Link to="/" className="text-slate-500 hover:text-indigo-500 text-sm font-bold flex items-center gap-2 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>

        <div className="max-w-md w-full">
          <div className="lg:hidden mb-8 text-center">
            <Logo className="h-10 w-10 mx-auto" />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-slate-400">Join Enlighten Pharma Academy today.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center text-rose-400 text-sm">
              <AlertCircle className="h-5 w-5 mr-3 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                <input
                  required
                  type="text"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all placeholder:text-slate-600"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                <input
                  required
                  type="email"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all placeholder:text-slate-600"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                <input
                  required
                  type="password"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all placeholder:text-slate-600"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                <input
                  required
                  type="password"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all placeholder:text-slate-600"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-teal-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Create Account
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-400">
            Already have an account? <Link to="/login" className="text-teal-400 hover:text-white font-bold transition-colors">Log In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
