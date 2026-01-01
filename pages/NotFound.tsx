
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-950 text-center px-4">
      <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-lg animate-float">
        <AlertCircle className="h-12 w-12 text-slate-500" />
      </div>
      <h1 className="text-6xl font-bold text-white mb-4 font-heading">404</h1>
      <h2 className="text-2xl font-semibold text-slate-300 mb-6">Page Not Found</h2>
      <p className="text-slate-400 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <button 
        onClick={() => navigate('/')}
        className="px-8 py-3 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-full transition-all shadow-lg flex items-center"
      >
        <Home className="mr-2 h-4 w-4" /> Return Home
      </button>
    </div>
  );
};
