import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { NeonButton } from '../components/UI';

export const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    adminSecret: ''
  });
  
  const [isRegistering, setIsRegistering] = useState(false);
  const { login, register, isLoading, error, clearError } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
  }, [isRegistering, clearError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) return;
    
    let user;
    if (isRegistering) {
       user = await register(formData.username, formData.password, formData.email, formData.adminSecret);
    } else {
       user = await login(formData.username, formData.password);
    }
    
    if (user) {
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in">
      <div className="w-full max-w-md p-8 glass-panel border-t-2 border-t-cyber-primary rounded-sm relative overflow-hidden">
        {/* Decorative BG */}
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <svg width="100" height="100" viewBox="0 0 100 100">
             <path d="M0 0 L100 0 L100 100 L0 100 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
             <path d="M0 0 L100 100" stroke="currentColor" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold font-sans mb-2 text-white">
          {isRegistering ? 'NEW IDENTITY' : 'ACCESS PORTAL'}
        </h2>
        <p className="text-gray-400 font-mono text-xs mb-8">
          {isRegistering ? 'ESTABLISH NEURAL LINK FOR NEW ACCOUNT' : 'SECURE AUTHENTICATION REQUIRED'}
        </p>
        
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-mono">
            ERROR: {error}
          </div>
        )}
        
        <div className="flex gap-4 mb-6 border-b border-white/10">
          <button 
            type="button"
            onClick={() => setIsRegistering(false)}
            className={`pb-2 text-sm font-mono transition-colors ${!isRegistering ? 'text-cyber-primary border-b border-cyber-primary' : 'text-gray-500 hover:text-gray-300'}`}
          >
            LOGIN
          </button>
          <button 
            type="button"
            onClick={() => setIsRegistering(true)}
            className={`pb-2 text-sm font-mono transition-colors ${isRegistering ? 'text-cyber-primary border-b border-cyber-primary' : 'text-gray-500 hover:text-gray-300'}`}
          >
            REGISTER
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-mono text-cyber-primary">USERNAME_ID</label>
            <input 
              name="username"
              type="text" 
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-cyber-primary focus:outline-none font-mono placeholder-gray-700"
              placeholder={isRegistering ? "CHOOSE ALIAS" : "ENTER USERNAME"}
              required
            />
          </div>

          {isRegistering && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <label className="text-xs font-mono text-cyber-primary">EMAIL_LINK</label>
              <input 
                name="email"
                type="email" 
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-cyber-primary focus:outline-none font-mono placeholder-gray-700"
                placeholder="CONTACT EMAIL"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-mono text-cyber-primary">ACCESS_KEY (PASSWORD)</label>
            <input 
              name="password"
              type="password" 
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-cyber-primary focus:outline-none font-mono placeholder-gray-700"
              placeholder="••••••••"
              required
            />
          </div>

          {isRegistering && (
             <div className="space-y-2 pt-2 border-t border-dashed border-white/10 animate-in fade-in slide-in-from-top-2">
                <label className="text-[10px] font-mono text-gray-500">ADMIN SECRET (OPTIONAL)</label>
                <input 
                  name="adminSecret"
                  type="password" 
                  value={formData.adminSecret}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/5 p-2 text-sm text-white focus:border-cyber-secondary focus:outline-none font-mono placeholder-gray-800"
                  placeholder="ENTER KEY FOR ADMIN ROLE"
                />
             </div>
          )}
          
          <NeonButton disabled={isLoading} type="submit" className="w-full mt-4">
            {isLoading ? 'PROCESSING...' : (isRegistering ? 'CREATE IDENTITY' : 'INITIATE SESSION')}
          </NeonButton>
          
          {!isRegistering && (
            <div className="mt-4 text-[10px] text-gray-500 font-mono text-center space-y-1">
               <p>DEMO USERS:</p>
               <p>User: <span className="text-white">ProSeller_X</span> / <span className="text-white">password123</span></p>
               <p>Admin: <span className="text-white">NexusAdmin</span> / <span className="text-white">admin</span></p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};