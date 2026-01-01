
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { Reveal } from '../components/Reveal';
import { LogIn, Mail, Lock, AlertCircle, ShieldCheck, Clock, ArrowLeft, GraduationCap, Sparkles } from 'lucide-react';
import { Logo } from '../components/Logo';

export const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);

  // DIAGNOSTIC STATE
  const [apiStatus, setApiStatus] = useState<string>('Checking Server...');
  React.useEffect(() => {
    // @ts-ignore
    const url = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';
    fetch(`${url}/health`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error(res.status + ' ' + res.statusText);
      })
      .then(data => setApiStatus(`✅ Online`))
      .catch(err => setApiStatus(`❌ Offline`));
  }, []);

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
    <div className="min-h-screen flex w-full relative bg-slate-950 overflow-hidden font-sans">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/assets/grid.svg')] opacity-10"></div>
      </div>

      {/* Left Side - Visuals (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative z-10 items-center justify-center p-12">
        <div className="max-w-xl">
          <Reveal width="100%">
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
              <Sparkles className="w-3 h-3" /> Premier Education
            </div>
          </Reveal>
          <Reveal width="100%" delay={0.1}>
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight font-heading">
              Master Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-400">Pharmacy Career</span>
            </h1>
          </Reveal>
          <Reveal width="100%" delay={0.2}>
            <p className="text-xl text-slate-400 mb-8 leading-relaxed">
              Join thousands of students achieving excellence in GPAT, NIPER, and other competitive exams with Enlighten Academy.
            </p>
          </Reveal>

          {/* Testimonial / Stats */}
          <Reveal width="100%" delay={0.3}>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                <h3 className="text-3xl font-bold text-white mb-1">10k+</h3>
                <p className="text-slate-400 text-sm">Active Students</p>
              </div>
              <div className="glass-card p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                <h3 className="text-3xl font-bold text-white mb-1">98%</h3>
                <p className="text-slate-400 text-sm">Success Rate</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12 relative z-10 backdrop-blur-sm lg:backdrop-blur-none bg-slate-950/50 lg:bg-transparent">

        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white text-sm mb-8 transition-colors group">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>

            <div className="flex justify-center lg:justify-start mb-6">
              <Logo className="h-12 w-12" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400">Please enter your details to sign in.</p>
          </div>

          <div className="glass-card p-1 rounded-2xl bg-slate-900/50 border border-white/10">
            <div className="flex">
              <button
                onClick={() => { setRole('student'); setError(''); setIsPending(false); }}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${role === 'student' ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                <GraduationCap className="w-4 h-4" /> Student
              </button>
              <button
                onClick={() => { setRole('admin'); setError(''); setIsPending(false); }}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${role === 'admin' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                <ShieldCheck className="w-4 h-4" /> Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start text-rose-400 text-sm animate-shake">
              <AlertCircle className="h-5 w-5 mr-3 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {isPending && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start text-amber-400 text-sm animate-fade-in">
              <Clock className="h-5 w-5 mr-3 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-1">Approval Pending</span>
                Your account is currently waiting for admin approval. Please check back later.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                </div>
                <input
                  required
                  type="email"
                  className="block w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">Forgot Password?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                </div>
                <input
                  required
                  type="password"
                  className="block w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-4 rounded-2xl font-bold text-lg text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 ${role === 'student'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500'
                  : 'bg-gradient-to-r from-indigo-500 to-violet-600'
                }`}
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </button>
          </form>

          {role === 'student' && (
            <div className="text-center mt-6">
              <p className="text-slate-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-white font-bold hover:text-teal-400 transition-colors">
                  Create free account
                </Link>
              </p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
              Secure Connection • {apiStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
