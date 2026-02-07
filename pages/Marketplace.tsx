import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { Listing } from '../types';
import { Icons } from '../constants';
import { Badge, StatBox, NeonButton } from '../components/UI';

const ListingCard: React.FC<{ listing: Listing }> = ({ listing }) => {
  return (
    <Link to={`/account/${listing.id}`} className="group block h-full">
      <div className="h-full glass-panel flex flex-col border border-white/5 hover:border-cyber-primary/50 transition-all duration-300 relative overflow-hidden">
        {/* Background Image if available */}
        {listing.images && listing.images.length > 0 && (
           <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500">
             <img src={listing.images[0]} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-black/80 to-cyber-black"></div>
           </div>
        )}
        
        {/* Hover Effect Background */}
        <div className={`absolute inset-0 bg-cyber-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0 ${listing.images.length > 0 ? 'mix-blend-overlay' : ''}`}></div>

        {/* Featured Tag */}
        {listing.featured && (
          <div className="absolute top-0 right-0 bg-cyber-secondary text-white text-[10px] font-bold px-2 py-1 z-10 font-mono">
            FEATURED
          </div>
        )}

        <div className="p-4 relative z-10 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
             <div>
               <div className="flex gap-2 mb-1">
                 <Badge variant={listing.status === 'available' ? 'success' : 'danger'}>{listing.status.toUpperCase()}</Badge>
                 <Badge variant="neutral">{listing.region}</Badge>
               </div>
               <h3 className="text-lg font-bold font-sans text-white leading-tight line-clamp-2 group-hover:text-cyber-primary transition-colors text-shadow-sm">
                 {listing.title}
               </h3>
             </div>
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <StatBox label="LEVEL" value={listing.level} />
            <StatBox label="LIKES" value={listing.likes > 1000 ? `${(listing.likes/1000).toFixed(1)}k` : listing.likes} />
            <StatBox label="VAULT" value={listing.vaultCount} />
          </div>

          {/* Highlights */}
          <div className="space-y-1 mb-4 flex-1">
            {listing.highlights.slice(0, 3).map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-400 font-mono group-hover:text-gray-300">
                <span className="text-cyber-primary">►</span> {h}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="text-xs text-gray-500 font-mono group-hover:text-gray-400">
              {new Date(listing.createdAt).toLocaleDateString()}
            </div>
            <div className="text-2xl font-bold font-sans text-white group-hover:text-cyber-primary group-hover:text-glow transition-all">
              ${listing.price}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const Marketplace = () => {
  const { listings, fetchListings, isLoading, user } = useStore();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-cyber-primary font-mono animate-pulse">LOADING MARKET DATA...</div>;
  }

  const filteredListings = listings.filter(l => filter === 'all' || l.status === filter);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
        <div className="glass-panel p-4">
          <div className="flex items-center gap-2 mb-4 text-cyber-primary font-bold font-mono">
            <Icons.Filter /> FILTERS
          </div>
          
          <div className="space-y-2">
            <button 
              onClick={() => setFilter('all')}
              className={`w-full text-left px-3 py-2 text-sm font-mono rounded-sm transition-colors ${filter === 'all' ? 'bg-cyber-primary text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              ALL LISTINGS
            </button>
            <button 
              onClick={() => setFilter('available')}
              className={`w-full text-left px-3 py-2 text-sm font-mono rounded-sm transition-colors ${filter === 'available' ? 'bg-cyber-success text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              AVAILABLE ONLY
            </button>
            <button 
              onClick={() => setFilter('reserved')}
              className={`w-full text-left px-3 py-2 text-sm font-mono rounded-sm transition-colors ${filter === 'reserved' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              RESERVED
            </button>
             <button 
              onClick={() => setFilter('sold')}
              className={`w-full text-left px-3 py-2 text-sm font-mono rounded-sm transition-colors ${filter === 'sold' ? 'bg-red-500 text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              SOLD ARCHIVE
            </button>
          </div>
        </div>
      </aside>

      {/* Main Grid */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold font-sans">
            MARKET_FEED <span className="text-cyber-primary">({filteredListings.length})</span>
          </h1>
          <div className="flex gap-2">
            {/* Mock Sort */}
            <select className="bg-black/50 border border-white/10 text-xs font-mono p-2 text-gray-300 focus:border-cyber-primary outline-none rounded-sm">
              <option>NEWEST ARRIVAL</option>
              <option>PRICE: LOW TO HIGH</option>
              <option>PRICE: HIGH TO LOW</option>
              <option>HIGHEST LEVEL</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
        
        {filteredListings.length === 0 && (
           <div className="text-center py-20 text-gray-500 font-mono border border-dashed border-white/10 rounded-lg">
             NO DATA FOUND IN CURRENT SECTOR
           </div>
        )}
      </div>
    </div>
  );
};