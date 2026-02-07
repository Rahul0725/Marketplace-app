import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { listingService } from '../services/listingService';
import { ListingFormData, DEFAULT_LISTING_FORM, Listing } from '../types';
import { NeonButton, Badge, StatBox } from '../components/UI';
import { Icons } from '../constants';

const DynamicListInput: React.FC<{ 
  label: string; 
  items: string[]; 
  onChange: (items: string[]) => void;
  placeholder?: string;
}> = ({ label, items, onChange, placeholder }) => {
  const [current, setCurrent] = useState('');

  const add = () => {
    if (current.trim()) {
      onChange([...items, current.trim()]);
      setCurrent('');
    }
  };

  const remove = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-mono text-gray-400 uppercase">{label}</label>
      <div className="flex gap-2">
        <input 
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder || "Type and press enter..."}
          className="flex-1 bg-black/30 border border-white/10 p-2 text-sm text-white focus:border-cyber-primary outline-none font-mono"
        />
        <button type="button" onClick={add} className="px-3 bg-white/10 hover:bg-cyber-primary hover:text-black transition-colors">
          <Icons.Plus />
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 bg-white/5 border border-white/10 px-2 py-1 text-xs">
            <span>{item}</span>
            <button type="button" onClick={() => remove(idx)} className="text-gray-500 hover:text-red-500"><Icons.X /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CreateEditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, addListing, updateListingInStore } = useStore();
  const [formData, setFormData] = useState<ListingFormData>(DEFAULT_LISTING_FORM);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'collection' | 'stats' | 'media' | 'contact'>('basic');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (id) {
      setLoading(true);
      listingService.getById(id).then(listing => {
        if (listing) {
          // Verify ownership or admin - Client Side Check
          if (user.role !== 'admin' && listing.ownerId !== user.id) {
             console.warn("Unauthorized access attempt redirected.");
             navigate('/');
             return;
          }
          const { id: _, ownerId: __, featured: ___, createdAt: ____, updatedAt: _____, ...rest } = listing;
          setFormData(rest);
        }
        setLoading(false);
      });
    } else {
      // RESET FORM FOR CREATE MODE if navigating from edit page
      setFormData(DEFAULT_LISTING_FORM);
    }
  }, [id, user, navigate]);

  const handleChange = (field: keyof ListingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        handleChange('images', [...formData.images, base64String]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    handleChange('images', formData.images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      if (id) {
        // Pass user credentials to service for verification
        const updated = await listingService.update(id, formData, user.id, user.role);
        updateListingInStore(updated);
        navigate(`/account/${updated.id}`);
      } else {
        const created = await listingService.create(formData, user.id);
        addListing(created);
        navigate('/');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const Tabs = () => (
    <div className="flex border-b border-white/10 mb-6 overflow-x-auto no-scrollbar">
      {['basic', 'collection', 'stats', 'media', 'contact'].map(tab => (
         <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 text-sm font-mono uppercase tracking-wider whitespace-nowrap transition-colors ${activeTab === tab ? 'text-cyber-primary border-b-2 border-cyber-primary' : 'text-gray-500 hover:text-white'}`}
         >
           {tab}
         </button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Editor Form */}
      <div className="flex-1">
        <div className="glass-panel p-6">
          <h1 className="text-2xl font-bold font-sans mb-6 text-white flex items-center gap-2">
            {id ? <><Icons.Edit /> UPDATE LISTING</> : <><Icons.Plus /> CREATE NEW LISTING</>}
          </h1>
          
          <form onSubmit={handleSubmit}>
            <Tabs />

            <div className="space-y-6">
              {activeTab === 'basic' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
                  <div className="col-span-2 space-y-2">
                    <label className="text-xs font-mono text-gray-400">TITLE HEADER</label>
                    <input className="w-full bg-black/30 border border-white/10 p-3 text-white focus:border-cyber-primary outline-none" 
                      value={formData.title} onChange={e => handleChange('title', e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-400">LEVEL</label>
                    <input type="number" className="w-full bg-black/30 border border-white/10 p-3 text-white focus:border-cyber-primary outline-none"
                      value={formData.level} onChange={e => handleChange('level', parseInt(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-400">PRICE ($)</label>
                    <input type="number" className="w-full bg-black/30 border border-white/10 p-3 text-white focus:border-cyber-primary outline-none"
                      value={formData.price} onChange={e => handleChange('price', parseInt(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-400">REGION</label>
                    <select className="w-full bg-black/30 border border-white/10 p-3 text-white focus:border-cyber-primary outline-none"
                      value={formData.region} onChange={e => handleChange('region', e.target.value)}>
                        <option>NA</option><option>EU</option><option>BR</option><option>ASIA</option><option>MENA</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-400">LOGIN METHOD</label>
                    <select className="w-full bg-black/30 border border-white/10 p-3 text-white focus:border-cyber-primary outline-none"
                      value={formData.loginMethod} onChange={e => handleChange('loginMethod', e.target.value)}>
                        <option>Google</option><option>Facebook</option><option>VK</option><option>Twitter</option>
                    </select>
                  </div>
                   <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-400">STATUS</label>
                    <select className="w-full bg-black/30 border border-white/10 p-3 text-white focus:border-cyber-primary outline-none"
                      value={formData.status} onChange={e => handleChange('status', e.target.value)}>
                        <option value="available">Available</option><option value="reserved">Reserved</option><option value="sold">Sold</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'collection' && (
                <div className="space-y-6 animate-in fade-in">
                  <DynamicListInput label="RARE BUNDLES" items={formData.bundles} onChange={v => handleChange('bundles', v)} placeholder="e.g. Sakura, Hip Hop" />
                  <DynamicListInput label="EVO GUNS" items={formData.evoGuns} onChange={v => handleChange('evoGuns', v)} placeholder="e.g. Draco AK Max" />
                  <DynamicListInput label="ELITE PASSES" items={formData.elitePasses} onChange={v => handleChange('elitePasses', v)} />
                  <DynamicListInput label="CUSTOM HIGHLIGHTS" items={formData.highlights} onChange={v => handleChange('highlights', v)} placeholder="Short marketing bullets" />
                </div>
              )}

              {activeTab === 'stats' && (
                 <div className="grid grid-cols-2 gap-4 animate-in fade-in">
                   {[
                     { l: 'VAULT ITEMS', k: 'vaultCount' },
                     { l: 'GUN SKINS', k: 'gunVaultCount' },
                     { l: 'DRESSES', k: 'dressVaultCount' },
                     { l: 'EMOTES', k: 'emotesCount' },
                     { l: 'GLOO WALLS', k: 'glooWallCount' },
                     { l: 'LIKES', k: 'likes' }
                   ].map(stat => (
                     <div key={stat.k} className="space-y-2">
                        <label className="text-xs font-mono text-gray-400">{stat.l}</label>
                        <input type="number" className="w-full bg-black/30 border border-white/10 p-3 text-white focus:border-cyber-primary outline-none"
                          value={(formData as any)[stat.k]} onChange={e => handleChange(stat.k as any, parseInt(e.target.value))} />
                     </div>
                   ))}
                 </div>
              )}

              {activeTab === 'media' && (
                <div className="space-y-6 animate-in fade-in">
                   <div className="border border-dashed border-white/20 rounded-sm p-8 text-center hover:border-cyber-primary/50 transition-colors bg-white/5">
                      <input 
                        type="file" 
                        accept="image/*" 
                        id="image-upload" 
                        className="hidden" 
                        onChange={handleImageUpload}
                        disabled={formData.images.length >= 5}
                      />
                      <label htmlFor="image-upload" className={`cursor-pointer flex flex-col items-center gap-2 ${formData.images.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                         <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center text-cyber-primary">
                            <Icons.Upload />
                         </div>
                         <span className="font-mono text-sm text-gray-300">CLICK TO UPLOAD EVIDENCE</span>
                         <span className="text-[10px] text-gray-500 font-mono">MAX 5 IMAGES • JPG/PNG</span>
                      </label>
                   </div>

                   {formData.images.length > 0 && (
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       {formData.images.map((img, idx) => (
                         <div key={idx} className="relative aspect-square bg-black/50 border border-white/10 rounded-sm overflow-hidden group">
                           <img src={img} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                           <button 
                             type="button"
                             onClick={() => removeImage(idx)}
                             className="absolute top-1 right-1 p-1 bg-red-500/80 text-white rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                             <Icons.X />
                           </button>
                           {idx === 0 && <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-cyber-primary text-black text-[10px] font-bold">COVER</span>}
                         </div>
                       ))}
                     </div>
                   )}
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-400">CONTACT USERNAME</label>
                    <input className="w-full bg-black/30 border border-white/10 p-3 text-white focus:border-cyber-primary outline-none"
                      value={formData.contactUsername} onChange={e => handleChange('contactUsername', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-400">PROOF LINK (Google Drive/Imgur)</label>
                    <input className="w-full bg-black/30 border border-white/10 p-3 text-white focus:border-cyber-primary outline-none"
                      value={formData.proofLink} onChange={e => handleChange('proofLink', e.target.value)} />
                  </div>
                  <DynamicListInput label="PAYMENT METHODS" items={formData.paymentMethods} onChange={v => handleChange('paymentMethods', v)} />
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex gap-4">
               <NeonButton type="submit" disabled={loading}>
                 {loading ? 'PROCESSING...' : (id ? 'SAVE CHANGES' : 'PUBLISH LISTING')}
               </NeonButton>
               <button type="button" onClick={() => navigate('/')} className="px-6 py-3 font-mono text-sm text-gray-500 hover:text-white transition-colors">CANCEL</button>
            </div>
          </form>
        </div>
      </div>

      {/* Live Preview Panel */}
      <div className="hidden lg:block w-[400px] flex-shrink-0">
        <div className="sticky top-24">
          <div className="flex items-center gap-2 mb-4 text-cyber-primary font-mono text-sm">
             <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> LIVE PREVIEW
          </div>
          
          {/* Preview Card */}
          <div className="glass-panel border-t-4 border-t-cyber-primary overflow-hidden">
            {/* Image Preview Header */}
            {formData.images.length > 0 ? (
               <div className="h-48 w-full relative">
                 <img src={formData.images[0]} alt="cover" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                 <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-xl font-bold font-sans leading-tight text-white drop-shadow-md truncate">{formData.title || 'UNTITLED LISTING'}</h2>
                 </div>
               </div>
            ) : (
               <div className="p-5 pb-0">
                  <h2 className="text-xl font-bold font-sans leading-tight mb-4">{formData.title || 'UNTITLED LISTING'}</h2>
               </div>
            )}
            
            <div className="p-5">
              <div className="grid grid-cols-3 gap-2 mb-6">
                <StatBox label="LVL" value={formData.level} />
                <StatBox label="LIKES" value={formData.likes} />
                <StatBox label="PRICE" value={`$${formData.price}`} />
              </div>

              <div className="space-y-4 text-sm font-mono text-gray-300">
                <div>
                  <span className="text-cyber-primary font-bold block mb-1">► ACCOUNT DETAILS</span>
                  <div className="grid grid-cols-2 gap-y-1 pl-2 border-l border-white/10">
                    <div>Region: {formData.region}</div>
                    <div>Login: {formData.loginMethod}</div>
                    <div>Age: {formData.accountAge}</div>
                    <div>Vault: {formData.vaultCount}</div>
                  </div>
                </div>

                {formData.bundles.length > 0 && (
                  <div>
                    <span className="text-cyber-secondary font-bold block mb-1">► RARE ITEMS</span>
                    <ul className="pl-4 list-disc marker:text-cyber-secondary">
                      {formData.bundles.slice(0,4).map((b, i) => <li key={i}>{b}</li>)}
                      {formData.bundles.length > 4 && <li>...and {formData.bundles.length - 4} more</li>}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t border-dashed border-white/10 text-center">
                <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-sm text-xs font-mono">
                  SELLER: {formData.contactUsername || '---'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};