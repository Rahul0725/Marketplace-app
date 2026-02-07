import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../constants';
import { NeonButton, Badge, StatBox } from '../components/UI';

export const Profile = () => {
  const { user, updateProfile, applyForPremium } = useStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    email: '',
    avatarUrl: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setFormData({
        bio: user.bio || '',
        email: user.email || '',
        avatarUrl: user.avatarUrl || ''
      });
    }
  }, [user, navigate]);

  const handleSave = async () => {
    await updateProfile(formData);
    setIsEditing(false);
  };

  const handleApplyPremium = async () => {
     if(window.confirm("Submit application for Premium Seller status? Admins will review your profile.")) {
        await applyForPremium();
     }
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      <h1 className="text-3xl font-bold font-sans text-white mb-8 flex items-center gap-3">
        <Icons.User /> USER PROFILE
        <Badge variant={user.role === 'admin' ? 'secondary' : 'primary'}>{user.role.toUpperCase()}</Badge>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Info */}
        <div className="space-y-6">
          <div className={`glass-panel p-6 flex flex-col items-center text-center border-t-4 ${user.premiumStatus === 'approved' ? 'border-t-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.1)]' : 'border-t-cyber-primary'}`}>
             <div className={`w-32 h-32 rounded-full border-2 overflow-hidden mb-4 relative group ${user.premiumStatus === 'approved' ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.4)]' : 'border-cyber-primary/50 shadow-neon-blue'}`}>
                <img src={formData.avatarUrl} alt="profile" className="w-full h-full object-cover" />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs text-white">
                    Preview
                  </div>
                )}
             </div>
             
             <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2 justify-center">
               {user.username}
               {user.premiumStatus === 'approved' && <span title="Premium Seller"><Icons.Crown /></span>}
               {user.isVerified && <span title="Verified Identity"><Icons.Verified /></span>}
             </h2>
             <p className="text-xs font-mono text-gray-400 mb-4">ID: {user.id}</p>
             
             <div className="w-full pt-4 border-t border-white/10">
                <div className="text-[10px] uppercase text-gray-500 font-mono mb-1">MEMBER SINCE</div>
                <div className="text-sm text-white">{new Date(user.joinedAt || Date.now()).toLocaleDateString()}</div>
             </div>
          </div>

          <div className="glass-panel p-4 bg-gradient-to-br from-cyber-secondary/20 to-transparent border-cyber-secondary/30">
            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
               {user.premiumStatus === 'approved' ? <><Icons.Crown /> PREMIUM ACTIVE</> : 'PREMIUM STATUS'}
            </h4>
            
            {user.premiumStatus === 'none' && (
               <>
                  <p className="text-xs text-gray-400 mb-4">Get verified and access exclusive analytics tools.</p>
                  <button onClick={handleApplyPremium} className="w-full py-2 text-xs font-bold border border-cyber-secondary text-cyber-secondary hover:bg-cyber-secondary hover:text-white transition-colors">APPLY NOW</button>
               </>
            )}

            {user.premiumStatus === 'pending' && (
               <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-xs font-mono text-center">
                  APPLICATION UNDER REVIEW
               </div>
            )}

            {user.premiumStatus === 'approved' && (
               <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                     <span className="text-yellow-400">✓</span> Priority Listing
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                     <span className="text-yellow-400">✓</span> Gold Crown Badge
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                     <span className="text-yellow-400">✓</span> 0% Transaction Fees
                  </div>
               </div>
            )}
          </div>
        </div>

        {/* Right Column: Details & Edit Form */}
        <div className="md:col-span-2">
          <div className="glass-panel p-8 relative">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold font-sans text-white">PERSONAL DATA</h3>
               {!isEditing ? (
                 <button onClick={() => setIsEditing(true)} className="text-sm font-mono text-cyber-primary hover:text-white flex items-center gap-2">
                   <Icons.Edit /> EDIT PROFILE
                 </button>
               ) : (
                 <div className="flex gap-2">
                    <button onClick={() => setIsEditing(false)} className="text-xs font-mono text-gray-400 hover:text-white px-3 py-1">CANCEL</button>
                    <NeonButton onClick={handleSave} className="py-1 px-4 text-xs">SAVE</NeonButton>
                 </div>
               )}
             </div>

             <div className="space-y-6">
               <div className="space-y-2">
                 <label className="text-xs font-mono text-gray-500 uppercase">Biography</label>
                 {isEditing ? (
                   <textarea 
                     className="w-full bg-black/30 border border-white/10 p-3 text-white focus:border-cyber-primary outline-none font-mono text-sm min-h-[100px]"
                     value={formData.bio}
                     onChange={e => setFormData({...formData, bio: e.target.value})}
                   />
                 ) : (
                   <p className="text-sm text-gray-300 font-mono leading-relaxed border-l-2 border-white/10 pl-4">
                     {user.bio || "No bio set."}
                   </p>
                 )}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-500 uppercase">Contact Email</label>
                     {isEditing ? (
                       <input 
                         className="w-full bg-black/30 border border-white/10 p-3 text-white focus:border-cyber-primary outline-none font-mono text-sm"
                         value={formData.email}
                         onChange={e => setFormData({...formData, email: e.target.value})}
                       />
                     ) : (
                       <div className="text-sm text-white">{user.email || "Hidden"}</div>
                     )}
                  </div>
                  
                  {isEditing && (
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-gray-500 uppercase">Avatar URL</label>
                      <input 
                         className="w-full bg-black/30 border border-white/10 p-3 text-white focus:border-cyber-primary outline-none font-mono text-sm"
                         value={formData.avatarUrl}
                         onChange={e => setFormData({...formData, avatarUrl: e.target.value})}
                       />
                    </div>
                  )}
               </div>
             </div>

             {!isEditing && (
               <div className="mt-8 pt-6 border-t border-white/10">
                 <h4 className="text-xs font-bold text-gray-500 mb-4 uppercase">Security Settings</h4>
                 <div className="flex items-center justify-between bg-white/5 p-4 rounded-sm border border-white/5">
                    <div className="text-sm text-white">
                      <span className="block font-bold">Password</span>
                      <span className="text-xs text-gray-500">Last changed recently</span>
                    </div>
                    <button className="px-3 py-1 border border-white/10 text-xs hover:bg-white/10 text-gray-400">CHANGE</button>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};