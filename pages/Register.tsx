
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, User } from '../utils/api';
import { Reveal } from '../components/Reveal';
import { UserPlus, Mail, Lock, User as UserIcon, AlertCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '../components/Toast';

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
        addToast("Registration successful! Please wait for approval.", 'success');
        navigate('/login');
      } else {
        setError(res.message || "Registration failed");
        addToast(res.message || "Registration failed", 'error');
      }
    } catch (e) {
      setError("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 to-slate-900 pointer-events-none"></div>

      <Reveal width="100%" className="max-w-md w-full">
        <div className="glass-card p-8 rounded-2xl shadow-2xl shadow-black/50 border border-white/10 relative z-10">
          <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-slate-400">Join Enlighten Pharma Academy</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center text-red-400 text-sm">
              <AlertCircle className="h-4 w-4 mr-2" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  required
                  type="text"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  required
                  type="email"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  required
                  type="password"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  required
                  type="password"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-teal-500 text-white font-bold py-3.5 rounded-xl hover:bg-teal-400 transition shadow-lg shadow-teal-500/20 flex items-center justify-center">
              <UserPlus className="h-5 w-5 mr-2" /> Register Now
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            Already have an account? <Link to="/login" className="text-teal-400 hover:text-teal-300 font-medium">Login here</Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
};
