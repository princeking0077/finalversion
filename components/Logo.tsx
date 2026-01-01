
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export const Logo = ({ className = "h-8 w-8", variant = 'light' }: LogoProps) => {
  const primaryColor = "#14b8a6"; // teal-500
  const secondaryColor = variant === 'light' ? "#ffffff" : "#0f172a";

  return (
    <div className="flex items-center gap-2 select-none">
      <div className="relative flex items-center justify-center">
        {/* Abstract Icon: Cross + Book + Leaf */}
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className={className}
        >
          {/* Shield/Background Shape */}
          <path d="M50 5L15 20V45C15 68.5 29.5 89.5 50 95C70.5 89.5 85 68.5 85 45V20L50 5Z" fill="url(#logo-gradient)" stroke={primaryColor} strokeWidth="2" fillOpacity="0.2"/>
          
          {/* Medical Cross styled as open book pages */}
          <path d="M50 25V75" stroke={primaryColor} strokeWidth="6" strokeLinecap="round"/>
          <path d="M30 40C30 40 40 45 50 45C60 45 70 40 70 40" stroke={primaryColor} strokeWidth="6" strokeLinecap="round"/>
          <path d="M30 60C30 60 40 65 50 65C60 65 70 60 70 60" stroke={primaryColor} strokeWidth="6" strokeLinecap="round"/>
          
          {/* Leaf element indicating growth/pharma */}
          <path d="M50 25C50 25 65 15 75 25C85 35 75 50 50 45" fill={primaryColor} fillOpacity="0.8"/>
          
          <defs>
            <linearGradient id="logo-gradient" x1="15" y1="5" x2="85" y2="95" gradientUnits="userSpaceOnUse">
              <stop stopColor="#14b8a6" />
              <stop offset="1" stopColor="#0f172a" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="flex flex-col">
        <span className={`text-lg font-bold tracking-tight leading-none ${variant === 'light' ? 'text-white' : 'text-slate-900'}`}>
          Enlighten<span className="text-teal-500">.</span>
        </span>
        <span className="text-[9px] font-bold text-teal-500 tracking-[0.2em] uppercase">Pharma Academy</span>
      </div>
    </div>
  );
};
