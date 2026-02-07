import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { listingService } from '../services/listingService';
import { Listing, User } from '../types';
import { Icons } from '../constants';
import { NeonButton, Badge, StatBox } from '../components/UI';
import { useStore } from '../store';

export const ListingDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const [activeImg, setActiveImg] = useState<number>(0);
  const { user, allUsers, fetchAllUsers } = useStore();

  useEffect(() => {
    // Ensure we have user data to verify the seller status
    fetchAllUsers();
    if (id) {
      listingService.getById(id).then((data) => setListing(data || null));
    }
  }, [id, fetchAllUsers]);

  // Find seller info from store when listing loads
  useEffect(() => {
    if (listing && allUsers.length > 0) {
      const found = allUsers.find(u => u.id === listing.ownerId);
      if (found) setSeller(found);
    }
  }, [listing, allUsers]);

  if (!listing) return <div className="text-center py-20 animate-pulse text-cyber-primary">FETCHING SECURE DATA...</div>;

  const isOwnerOrAdmin = user && (user.role === 'admin' || user.id === listing.ownerId);

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="text-gray-500 hover:text-white flex items-center gap-2 font-mono text-sm">
          <Icons.X /> RETURN TO MARKET
        </Link>
        {isOwnerOrAdmin && (
           <Link to={`/edit-post/${listing.id}`}>
             <NeonButton variant="ghost" className="text-xs py-2 px-4 flex items-center gap-2">
               <Icons.Edit /> EDIT LISTING
             </NeonButton>
           </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (Left 2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header Card */}
          <div className={`glass-panel p-6 border-l-4 relative overflow-hidden ${seller?.premiumStatus === 'approved' ? 'border-l-yellow-400' : 'border-l-cyber-primary'}`}>
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
               <Icons.Zap />
             </div>
             
             <div className="flex flex-wrap gap-2 mb-4">
               <Badge variant={listing.status === 'available' ? 'success' : 'danger'}>{listing.status}</Badge>
               <Badge variant="neutral">REGION: {listing.region}</Badge>
               <Badge variant="neutral">LOGIN: {listing.loginMethod}</Badge>
               {seller?.premiumStatus === 'approved' && <Badge variant="secondary">PREMIUM SELLER</Badge>}
             </div>
             
             <h1 className="text-3xl md:text-4xl font-bold font-sans text-white mb-4 text-glow">
               {listing.title}
             </h1>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
               <StatBox label="LEVEL" value={listing.level} />
               <StatBox label="LIKES" value={listing.likes} />
               <StatBox label="VAULT" value={listing.vaultCount} />
               <StatBox label="AGE" value={listing.accountAge} />
             </div>
          </div>

          {/* Visual Gallery */}
          {listing.images && listing.images.length > 0 && (
            <div className="glass-panel p-6">
              <h3 className="text-cyber-primary font-mono font-bold mb-4 flex items-center gap-2">
                <Icons.Image /> VISUAL EVIDENCE
              </h3>
              
              <div className="mb-4 aspect-video bg-black/50 border border-white/5 rounded-sm overflow-hidden">
                <img src={listing.images[activeImg]} alt="main-view" className="w-full h-full object-contain" />
              </div>
              
              {listing.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {listing.images.map((img, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setActiveImg(idx)}
                      className={`w-20 h-20 flex-shrink-0 border-2 rounded-sm overflow-hidden transition-all ${activeImg === idx ? 'border-cyber-primary opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`}
                    >
                      <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Detailed Stats */}
          <div className="glass-panel p-6">
            <h3 className="text-cyber-primary font-mono font-bold mb-4 flex items-center gap-2">
              <Icons.List /> INVENTORY ANALYTICS
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
               <div className="space-y-1">
                 <div className="text-xs text-gray-500 font-mono">EVO GUNS</div>
                 <div className="text-xl font-bold">{listing.evoGuns.length}</div>
               </div>
               <div className="space-y-1">
                 <div className="text-xs text-gray-500 font-mono">GUN SKINS</div>
                 <div className="text-xl font-bold">{listing.gunVaultCount}</div>
               </div>
               <div className="space-y-1">
                 <div className="text-xs text-gray-500 font-mono">OUTFITS</div>
                 <div className="text-xl font-bold">{listing.dressVaultCount}</div>
               </div>
               <div className="space-y-1">
                 <div className="text-xs text-gray-500 font-mono">EMOTES</div>
                 <div className="text-xl font-bold">{listing.emotesCount}</div>
               </div>
               <div className="space-y-1">
                 <div className="text-xs text-gray-500 font-mono">GLOO WALLS</div>
                 <div className="text-xl font-bold">{listing.glooWallCount}</div>
               </div>
            </div>
          </div>

          {/* Collections Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 border-t border-cyber-secondary/30">
              <h4 className="text-cyber-secondary font-mono font-bold mb-3 uppercase">Rare Bundles</h4>
              <ul className="space-y-2">
                {listing.bundles.length > 0 ? listing.bundles.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-cyber-secondary mt-1">▪</span> {b}
                  </li>
                )) : <li className="text-gray-600 italic">None listed</li>}
              </ul>
            </div>

             <div className="glass-panel p-6 border-t border-cyber-accent/30">
              <h4 className="text-cyber-accent font-mono font-bold mb-3 uppercase">Evo Weaponry</h4>
              <ul className="space-y-2">
                {listing.evoGuns.length > 0 ? listing.evoGuns.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-cyber-accent mt-1">▪</span> {b}
                  </li>
                )) : <li className="text-gray-600 italic">None listed</li>}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar (Right Col) */}
        <div className="space-y-6">
          {/* Price Card */}
          <div className={`glass-panel p-6 text-center sticky top-24 ${seller?.premiumStatus === 'approved' ? 'shadow-[0_0_20px_rgba(250,204,21,0.1)] border-yellow-400/20' : ''}`}>
             <div className="text-xs text-gray-500 font-mono mb-1 uppercase">Current Asking Price</div>
             <div className="text-5xl font-bold text-white mb-6 text-shadow-glow">${listing.price}</div>
             
             <NeonButton className="w-full mb-3" variant={seller?.premiumStatus === 'approved' ? 'secondary' : 'primary'}>
               CONTACT SELLER
             </NeonButton>
             
             <div className="text-xs font-mono text-gray-400 flex items-center justify-center gap-1">
               SELLER: <span className="text-white font-bold">{listing.contactUsername}</span>
               {seller?.premiumStatus === 'approved' && <span title="Premium Seller"><Icons.Crown /></span>}
               {seller?.isVerified && <span title="Verified"><Icons.Verified /></span>}
             </div>
             
             <div className="mt-6 pt-6 border-t border-white/10 space-y-3 text-left">
                <div className="text-xs font-bold text-gray-400 uppercase">Accepted Payments</div>
                <div className="flex flex-wrap gap-2">
                  {listing.paymentMethods.map(pm => (
                    <span key={pm} className="px-2 py-1 bg-white/5 text-[10px] uppercase font-mono border border-white/10">{pm}</span>
                  ))}
                </div>
             </div>

             {listing.proofLink && (
               <a href={listing.proofLink} target="_blank" rel="noreferrer" className="block mt-4 text-xs text-cyber-primary hover:underline font-mono">
                 VIEW PROOF / VIDEO
               </a>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};