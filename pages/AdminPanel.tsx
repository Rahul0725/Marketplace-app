import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { useNavigate, Link } from 'react-router-dom';
import { listingService } from '../services/listingService';
import { Icons } from '../constants';
import { Badge } from '../components/UI';
import { PremiumStatus } from '../types';

export const AdminPanel = () => {
  const { user, listings, allUsers, fetchListings, fetchAllUsers, removeListingFromStore, updateListingInStore, toggleUserVerification, setPremiumStatus } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'listings' | 'users' | 'applications'>('applications');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    } else {
      fetchListings();
      fetchAllUsers();
    }
  }, [user, navigate, fetchListings, fetchAllUsers]);

  const handleDeleteListing = async (id: string) => {
    if (!user) return;
    if (window.confirm('WARNING: PERMANENT DELETION. CONFIRM?')) {
      try {
         await listingService.delete(id, user.id, user.role);
         removeListingFromStore(id);
      } catch(e: any) {
         alert(e.message);
      }
    }
  };

  const toggleFeatured = async (id: string) => {
      const updated = await listingService.toggleFeature(id);
      updateListingInStore(updated);
  }

  const handleToggleVerification = async (id: string) => {
      await toggleUserVerification(id);
  }
  
  const handlePremiumStatus = async (id: string, status: PremiumStatus) => {
     await setPremiumStatus(id, status);
  }

  // Filter for pending applications
  const pendingApplications = allUsers.filter(u => u.premiumStatus === 'pending');

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex items-center justify-between border-b border-red-900/30 pb-6">
        <div>
          <h1 className="text-3xl font-bold font-sans text-white tracking-widest">COMMAND CENTER</h1>
          <div className="text-xs font-mono text-red-500">OPERATOR: {user?.username.toUpperCase()}</div>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex gap-2">
           <button 
             onClick={() => setActiveTab('applications')} 
             className={`px-4 py-2 text-xs font-mono border transition-all flex items-center gap-2 ${activeTab === 'applications' ? 'bg-red-600 border-red-600 text-black font-bold' : 'border-red-900/30 text-gray-400 hover:text-red-400'}`}
           >
             APPLICATIONS {pendingApplications.length > 0 && <span className="bg-white text-black text-[10px] px-1.5 rounded-full">{pendingApplications.length}</span>}
           </button>
           <button 
             onClick={() => setActiveTab('listings')} 
             className={`px-4 py-2 text-xs font-mono border transition-all ${activeTab === 'listings' ? 'bg-red-600 border-red-600 text-black font-bold' : 'border-red-900/30 text-gray-400 hover:text-red-400'}`}
           >
             LISTING_DB
           </button>
           <button 
             onClick={() => setActiveTab('users')} 
             className={`px-4 py-2 text-xs font-mono border transition-all ${activeTab === 'users' ? 'bg-red-600 border-red-600 text-black font-bold' : 'border-red-900/30 text-gray-400 hover:text-red-400'}`}
           >
             USER_MGMT
           </button>
        </div>
      </div>

      <div className="bg-black/40 border border-red-900/30 backdrop-blur-sm min-h-[500px]">
        {activeTab === 'applications' && (
          <div className="p-6">
            <h2 className="text-red-500 font-mono text-sm mb-4 uppercase tracking-widest">Pending Premium Requests</h2>
            {pendingApplications.length === 0 ? (
               <div className="text-center py-20 text-gray-600 font-mono italic">No pending applications in queue.</div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {pendingApplications.map(applicant => (
                    <div key={applicant.id} className="border border-red-900/30 bg-red-950/10 p-4 relative">
                       <div className="absolute top-2 right-2 text-[10px] text-red-400 font-mono">REQ_ID: {applicant.id}</div>
                       <div className="flex items-center gap-3 mb-4">
                          <img src={applicant.avatarUrl} className="w-12 h-12 rounded-full border border-red-500/50" alt="" />
                          <div>
                            <div className="text-white font-bold">{applicant.username}</div>
                            <div className="text-xs text-gray-500">{applicant.email}</div>
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-2 mb-4">
                         <div className="bg-black/30 p-2 text-center">
                           <div className="text-[10px] text-gray-500">JOINED</div>
                           <div className="text-xs text-white">{new Date(applicant.joinedAt || '').toLocaleDateString()}</div>
                         </div>
                         <div className="bg-black/30 p-2 text-center">
                           <div className="text-[10px] text-gray-500">VERIFIED</div>
                           <div className={`text-xs ${applicant.isVerified ? 'text-green-500' : 'text-red-500'}`}>{applicant.isVerified ? 'YES' : 'NO'}</div>
                         </div>
                       </div>
                       
                       <div className="flex gap-2">
                          <button onClick={() => handlePremiumStatus(applicant.id, 'approved')} className="flex-1 bg-green-600/20 hover:bg-green-600/40 text-green-500 border border-green-600/50 py-2 text-xs font-bold transition-colors">APPROVE</button>
                          <button onClick={() => handlePremiumStatus(applicant.id, 'none')} className="flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-500 border border-red-600/50 py-2 text-xs font-bold transition-colors">REJECT</button>
                       </div>
                    </div>
                 ))}
               </div>
            )}
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-red-950/20 text-xs font-mono text-red-400 uppercase">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-900/10">
                {listings.map(l => (
                  <tr key={l.id} className="hover:bg-red-900/5 transition-colors">
                    <td className="p-4 font-mono text-xs text-gray-500">{l.id}</td>
                    <td className="p-4 font-bold text-sm max-w-xs truncate text-gray-300">{l.title}</td>
                    <td className="p-4 font-mono text-sm text-white">${l.price}</td>
                    <td className="p-4">
                      <Badge variant={l.status === 'available' ? 'success' : 'neutral'}>{l.status}</Badge>
                    </td>
                    <td className="p-4">
                        <button onClick={() => toggleFeatured(l.id)} className={`w-4 h-4 rounded-sm border ${l.featured ? 'bg-red-600 border-red-600' : 'border-gray-600'}`}></button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/edit-post/${l.id}`} className="p-2 text-gray-400 hover:text-white bg-black/50 rounded-sm">
                          <Icons.Edit />
                        </Link>
                        <button onClick={() => handleDeleteListing(l.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-sm">
                          <Icons.Trash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-red-950/20 text-xs font-mono text-red-400 uppercase">
                <tr>
                  <th className="p-4">User Identity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4">Verification</th>
                  <th className="p-4 text-right">Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-900/10">
                {allUsers.map(u => (
                  <tr key={u.id} className="hover:bg-red-900/5 transition-colors">
                    <td className="p-4">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-gray-800 overflow-hidden">
                           <img src={u.avatarUrl} alt="" className="w-full h-full object-cover"/>
                         </div>
                         <div>
                           <div className="font-bold text-sm text-white flex items-center gap-1">
                             {u.username}
                           </div>
                           <div className="text-[10px] font-mono text-gray-500">{u.email}</div>
                         </div>
                       </div>
                    </td>
                    <td className="p-4">
                       <div className="flex flex-col gap-1">
                          <Badge variant={u.role === 'admin' ? 'secondary' : 'primary'}>{u.role.toUpperCase()}</Badge>
                          {u.premiumStatus === 'approved' && <Badge variant="secondary">PREMIUM</Badge>}
                       </div>
                    </td>
                    <td className="p-4 font-mono text-xs text-gray-400">
                      {new Date(u.joinedAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                       <button 
                         onClick={() => handleToggleVerification(u.id)}
                         className={`flex items-center gap-2 px-3 py-1 rounded-sm border text-xs font-mono transition-all ${u.isVerified 
                           ? 'bg-blue-900/20 border-blue-500 text-blue-400' 
                           : 'bg-white/5 border-white/10 text-gray-500'}`}
                       >
                         {u.isVerified ? <><Icons.Check /> VERIFIED</> : 'UNVERIFIED'}
                       </button>
                    </td>
                    <td className="p-4 text-right">
                       {u.premiumStatus === 'approved' ? (
                          <button onClick={() => handlePremiumStatus(u.id, 'none')} className="text-[10px] text-red-500 hover:underline">REVOKE PREMIUM</button>
                       ) : (
                          <span className="text-[10px] text-gray-600">STANDARD</span>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};