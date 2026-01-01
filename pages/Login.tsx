
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { Reveal } from '../components/Reveal';
import { LogIn, Mail, Lock, AlertCircle, ShieldCheck, Clock, ArrowLeft } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsPending(false);

    try {
      const res = await api.login(formData.email, formData.password);

      if (!res.success || !res.user) {
        setError(res.message || "Invalid credentials");
        return;
      }

      const user = res.user;

      if (user.role !== role) {
        // Logout if role mismatch to clean state
        api.logout();
        setError(`This account is not registered as a ${role}`);
        return;
      }

      if (user.role === 'student' && user.status === 'pending') {
        setIsPending(true);
        return;
      }

      if (user.role === 'student' && user.status === 'rejected') {
        setError("Your account application was rejected. Please contact support.");
        return;
      }

      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (e) {
      setError("Login failed due to network error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/20 to-slate-900 pointer-events-none"></div>

      <Reveal width="100%" className="max-w-md w-full">
        <div className="glass-card p-8 rounded-2xl shadow-2xl shadow-black/50 border border-white/10 relative z-10">
          <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-slate-400">Login to access your dashboard</p>
          </div>

          <div className="flex bg-slate-950/50 p-1 rounded-xl mb-6 border border-white/5">
            <button
              onClick={() => { setRole('student'); setError(''); setIsPending(false); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === 'student' ? 'bg-teal-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Student
            </button>
            <button
              onClick={() => { setRole('admin'); setError(''); setIsPending(false); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === 'admin' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Admin
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start text-red-400 text-sm animate-fade-in">
              <AlertCircle className="h-5 w-5 mr-3 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {isPending && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start text-amber-400 text-sm animate-fade-in">
              <Clock className="h-5 w-5 mr-3 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-1">Approval Pending</span>
                Your account is currently waiting for admin approval. Please check back later or contact support.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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

            <button type="submit" className={`w-full text-white font-bold py-3.5 rounded-xl transition shadow-lg flex items-center justify-center ${role === 'admin' ? 'bg-indigo-500 hover:bg-indigo-400 shadow-indigo-500/20' : 'bg-teal-500 hover:bg-teal-400 shadow-teal-500/20'}`}>
              {role === 'admin' ? <ShieldCheck className="h-5 w-5 mr-2" /> : <LogIn className="h-5 w-5 mr-2" />}
              Login as {role === 'admin' ? 'Admin' : 'Student'}
            </button>
          </form>

          {role === 'student' && (
            <div className="mt-6 text-center text-sm text-slate-400">
              Don't have an account? <Link to="/register" className="text-teal-400 hover:text-teal-300 font-medium">Register here</Link>
            </div>
          )}

          {role === 'admin' && (
            <div className="mt-6 text-center text-xs text-slate-500">
              <p>Secure Admin Portal</p>
            </div>
          )}
        </div>
      </Reveal>
    </div>
  );
};
