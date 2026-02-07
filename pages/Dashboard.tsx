import React, { useEffect } from 'react';
import { useStore } from '../store';
import { Link, useNavigate } from 'react-router-dom';
import { Icons } from '../constants';
import { NeonButton, Badge, StatBox } from '../components/UI';
import { listingService } from '../services/listingService';

export const Dashboard = () => {
  const { user, listings, fetchListings, removeListingFromStore } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchListings();
    }
  }, [user, navigate, fetchListings]);

  const myListings = listings.filter(l => l.ownerId === user?.id);

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (window.confirm('DELETE LISTING?')) {
      try {
        await listingService.delete(id, user.id, user.role);
        removeListingFromStore(id);
      } catch (e: any) {
        alert(e.message);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
       {/* Header with Create Button */}
       <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold font-sans text-white mb-1">SELLER DASHBOARD</h1>
            <p className="text-gray-400 font-mono text-sm">MANAGE YOUR ASSETS & LISTINGS</p>
         </div>
         <Link to="/create-post">
           <NeonButton className="flex items-center gap-2">
             <Icons.Plus /> NEW LISTING
           </NeonButton>
         </Link>
       </div>

       {/* Stats Row */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-4 border-l-2 border-cyber-primary">
            <div className="text-gray-400 text-xs font-mono uppercase">Total Listings</div>
            <div className="text-2xl font-bold text-white">{myListings.length}</div>
          </div>
          <div className="glass-panel p-4 border-l-2 border-cyber-secondary">
            <div className="text-gray-400 text-xs font-mono uppercase">Total Value</div>
            <div className="text-2xl font-bold text-white">${myListings.reduce((acc, curr) => acc + curr.price, 0)}</div>
          </div>
           <div className="glass-panel p-4 border-l-2 border-cyber-success">
            <div className="text-gray-400 text-xs font-mono uppercase">Active</div>
            <div className="text-2xl font-bold text-white">{myListings.filter(l => l.status === 'available').length}</div>
          </div>
           <div className="glass-panel p-4 border-l-2 border-cyber-accent">
            <div className="text-gray-400 text-xs font-mono uppercase">Sold</div>
            <div className="text-2xl font-bold text-white">{myListings.filter(l => l.status === 'sold').length}</div>
          </div>
       </div>

       {/* Listings Grid */}
       <div className="grid grid-cols-1 gap-4">
         {myListings.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-sm">
               <p className="text-gray-500 font-mono mb-4">NO ACTIVE LISTINGS DETECTED</p>
               <Link to="/create-post">
                 <NeonButton variant="ghost">INITIALIZE FIRST LISTING</NeonButton>
               </Link>
            </div>
         ) : (
            myListings.map(listing => (
              <div key={listing.id} className="glass-panel p-4 flex flex-col md:flex-row items-center gap-6 group hover:border-white/20 transition-colors">
                  {/* Image/Thumb */}
                  <div className="w-full md:w-32 h-32 bg-black/50 rounded-sm overflow-hidden relative border border-white/10">
                     {listing.images?.[0] ? (
                       <img src={listing.images[0]} alt="" className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-gray-700">
                         <Icons.Image />
                       </div>
                     )}
                     <div className="absolute top-2 right-2">
                        <Badge variant={listing.status === 'available' ? 'success' : 'neutral'}>{listing.status}</Badge>
                     </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 w-full text-center md:text-left">
                     <h3 className="text-xl font-bold font-sans text-white mb-2">{listing.title}</h3>
                     <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-mono text-gray-400 mb-3">
                        <span className="flex items-center gap-1"><Icons.Zap /> LVL {listing.level}</span>
                        <span>REGION: {listing.region}</span>
                        <span>LIKES: {listing.likes}</span>
                     </div>
                     <div className="text-2xl font-bold text-cyber-primary">${listing.price}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                     <Link to={`/edit-post/${listing.id}`} className="flex-1">
                       <button className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white flex items-center justify-center gap-2 transition-colors">
                         <Icons.Edit /> EDIT
                       </button>
                     </Link>
                     <Link to={`/account/${listing.id}`} className="flex-1">
                        <button className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white flex items-center justify-center gap-2 transition-colors">
                          VIEW
                        </button>
                     </Link>
                     <button onClick={() => handleDelete(listing.id)} className="flex-1 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-mono text-red-500 flex items-center justify-center gap-2 transition-colors">
                        <Icons.Trash /> DELETE
                     </button>
                  </div>
              </div>
            ))
         )}
       </div>
    </div>
  );
};