import React from 'react';
import { Icons } from '../constants';

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'neutral' }> = ({ children, variant = 'neutral' }) => {
  const colors = {
    primary: 'bg-cyber-primary/10 text-cyber-primary border-cyber-primary/30',
    secondary: 'bg-cyber-secondary/10 text-cyber-secondary border-cyber-secondary/30',
    success: 'bg-cyber-success/10 text-cyber-success border-cyber-success/30',
    danger: 'bg-cyber-accent/10 text-cyber-accent border-cyber-accent/30',
    neutral: 'bg-white/5 text-gray-400 border-white/10',
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-mono border rounded-sm ${colors[variant]}`}>
      {children}
    </span>
  );
};

export const StatBox: React.FC<{ label: string; value: string | number; icon?: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="bg-cyber-gray/50 border border-white/5 p-2 rounded-sm flex flex-col items-center justify-center min-w-[80px]">
    <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mb-1">{label}</span>
    <div className="flex items-center gap-1">
      {icon && <span className="opacity-50 scale-75">{icon}</span>}
      <span className="text-lg font-bold font-sans text-white leading-none">{value}</span>
    </div>
  </div>
);

export const NeonButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }> = ({ className, variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-cyber-primary text-black hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]',
    secondary: 'bg-cyber-secondary text-white hover:bg-violet-600 shadow-neon-purple',
    ghost: 'bg-transparent border border-white/20 text-gray-300 hover:border-white hover:text-white',
  };
  
  return (
    <button 
      className={`px-6 py-3 font-mono text-sm font-bold uppercase tracking-wide transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    />
  );
};
