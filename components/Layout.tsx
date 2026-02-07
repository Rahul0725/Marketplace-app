import React from 'react';
import { useStore } from '../store';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icons } from '../constants';

const Navbar = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;
  const isAdmin = user?.role === 'admin';

  // Admin Theme Navbar
  if (isAdmin) {
     return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-red-900/50 bg-black/95 backdrop-blur-xl">
           <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
             <div className="flex items-center gap-4">
               <div className="w-8 h-8 bg-red-600 rounded-sm flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                 <Icons.Shield />
               </div>
               <div>
                  <div className="text-[10px] font-mono text-red-500 tracking-[0.2em]">SYSTEM_OVERRIDE</div>
                  <div className="font-sans font-bold text-xl text-white tracking-widest">NEXUS // ADMIN</div>
               </div>
             </div>

             <div className="flex items-center gap-6">
                <Link to="/control-panel" className={`text-xs font-mono tracking-widest hover:text-red-400 transition-colors ${isActive('/control-panel') ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                   COMMAND_CENTER
                </Link>
                <Link to="/" className={`text-xs font-mono tracking-widest hover:text-red-400 transition-colors ${isActive('/') ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                   VIEW_MARKET
                </Link>
                <div className="h-6 w-px bg-red-900/50"></div>
                <button onClick={handleLogout} className="text-xs font-mono text-gray-500 hover:text-white">
                   TERMINATE_SESSION
                </button>
             </div>
           </div>
        </nav>
     )
  }

  // Regular User Navbar
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/10 glass-panel">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-cyber-primary rounded-sm flex items-center justify-center shadow-neon-blue group-hover:scale-110 transition-transform">
             <span className="font-bold text-cyber-black text-xl">N</span>
          </div>
          <span className="font-sans font-bold text-2xl tracking-widest text-white group-hover:text-cyber-primary transition-colors">
            NEXUS
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={`text-sm font-mono tracking-wide hover:text-cyber-primary transition-colors ${isActive('/') ? 'text-cyber-primary' : 'text-gray-400'}`}>
            MARKETPLACE
          </Link>
          {user && (
            <Link to="/dashboard" className={`text-sm font-mono tracking-wide hover:text-cyber-primary transition-colors ${isActive('/dashboard') ? 'text-cyber-primary' : 'text-gray-400'}`}>
              DASHBOARD
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block">
                 <div className="text-xs text-cyber-primary font-mono">STATUS: ONLINE</div>
                 <div className="text-sm font-bold flex items-center gap-1 justify-end">
                    {user.username}
                    {user.premiumStatus === 'approved' && <span title="Premium"><Icons.Crown /></span>}
                 </div>
               </div>
               
               <div className="relative group">
                 <div className="w-10 h-10 rounded bg-cyber-gray border border-white/20 overflow-hidden cursor-pointer">
                   <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                 </div>
                 
                 {/* Dropdown Menu */}
                 <div className="absolute right-0 top-full mt-2 w-48 bg-black/90 border border-white/10 rounded-sm shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="py-2">
                       <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 font-mono">
                         MY PROFILE
                       </Link>
                       <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 font-mono">
                         DASHBOARD
                       </Link>
                       <div className="h-px bg-white/10 my-1"></div>
                       <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 font-mono font-bold">
                         LOGOUT
                       </button>
                    </div>
                 </div>
               </div>
            </div>
          ) : (
            <Link to="/login" className="px-6 py-2 bg-white/5 hover:bg-cyber-primary hover:text-black border border-cyber-primary/30 text-cyber-primary font-mono text-sm rounded-sm transition-all duration-300 shadow-neon-blue hover:shadow-none">
              LOGIN_SYSTEM
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useStore();
  const isAdmin = user?.role === 'admin';

  return (
    <div className={`min-h-screen pt-16 ${isAdmin ? 'bg-black' : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyber-gray via-cyber-black to-black'}`}>
      <div className={`fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0 mix-blend-overlay`}></div>
      
      {/* Admin specific background effect */}
      {isAdmin && (
         <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-red-900/10 to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-red-900/5 blur-[100px]"></div>
         </div>
      )}

      <Navbar />
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};