import { Listing, ListingFormData, Role } from '../types';
import { supabase } from '../lib/supabase';

// Helper to map DB listing to App Listing
const mapListing = (l: any): Listing => ({
  id: l.id,
  ownerId: l.owner_id,
  title: l.title,
  level: l.level,
  likes: l.likes,
  region: l.region,
  loginMethod: l.login_method,
  price: l.price,
  status: l.status,
  accountAge: l.account_age,
  primeLevel: l.prime_level,
  vaultCount: l.vault_count,
  bundles: l.bundles || [],
  evoGuns: l.evo_guns || [],
  elitePasses: l.elite_passes || [],
  rarityTags: l.rarity_tags || [],
  gunVaultCount: l.gun_vault_count,
  dressVaultCount: l.dress_vault_count,
  glooWallCount: l.gloo_wall_count,
  emotesCount: l.emotes_count,
  animationCount: l.animation_count,
  highlights: l.highlights || [],
  contactUsername: l.contact_username,
  proofLink: l.proof_link,
  paymentMethods: l.payment_methods || [],
  images: l.images || [],
  featured: l.featured,
  createdAt: l.created_at,
  updatedAt: l.updated_at,
});

export const listingService = {
  getAll: async (): Promise<Listing[]> => {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching listings:", error);
      return [];
    }
    return data.map(mapListing);
  },

  getById: async (id: string): Promise<Listing | undefined> => {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return undefined;
    return mapListing(data);
  },

  create: async (data: ListingFormData, ownerId: string): Promise<Listing> => {
    // Map camelCase to snake_case for DB
    const dbData = {
      owner_id: ownerId,
      title: data.title,
      level: data.level,
      likes: data.likes,
      region: data.region,
      login_method: data.loginMethod,
      price: data.price,
      status: data.status,
      account_age: data.accountAge,
      prime_level: data.primeLevel,
      vault_count: data.vaultCount,
      bundles: data.bundles,
      evo_guns: data.evoGuns,
      elite_passes: data.elitePasses,
      rarity_tags: data.rarityTags,
      gun_vault_count: data.gunVaultCount,
      dress_vault_count: data.dressVaultCount,
      gloo_wall_count: data.glooWallCount,
      emotes_count: data.emotesCount,
      animation_count: data.animationCount,
      highlights: data.highlights,
      contact_username: data.contactUsername,
      proof_link: data.proofLink,
      payment_methods: data.paymentMethods,
      images: data.images,
      featured: false,
    };

    const { data: newListing, error } = await supabase
      .from('listings')
      .insert([dbData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapListing(newListing);
  },

  update: async (id: string, data: Partial<ListingFormData>, requestorId: string, requestorRole: Role): Promise<Listing> => {
    // Ownership Check via DB select first or assume RLS. 
    // We will do a quick check here for UX feedback
    if (requestorRole !== 'admin') {
      const { data: current } = await supabase.from('listings').select('owner_id').eq('id', id).single();
      if (current && current.owner_id !== requestorId) {
        throw new Error('UNAUTHORIZED: YOU DO NOT OWN THIS LISTING');
      }
    }

    const updates: any = {};
    if (data.title) updates.title = data.title;
    if (data.price) updates.price = data.price;
    if (data.status) updates.status = data.status;
    // ... map other fields as needed for updates. For brevity, assuming full form update or key fields.
    // Mapping complex object updates:
    Object.keys(data).forEach(key => {
        // Simple mapping for demonstration. Real app needs precise map.
        // e.g. loginMethod -> login_method
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        updates[snakeKey] = (data as any)[key];
    });
    
    updates.updated_at = new Date().toISOString();

    const { data: updated, error } = await supabase
      .from('listings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapListing(updated);
  },

  delete: async (id: string, requestorId: string, requestorRole: Role): Promise<void> => {
     if (requestorRole !== 'admin') {
      const { data: current } = await supabase.from('listings').select('owner_id').eq('id', id).single();
      if (current && current.owner_id !== requestorId) {
        throw new Error('UNAUTHORIZED: CANNOT DELETE OTHERS DATA');
      }
    }

    const { error } = await supabase.from('listings').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  toggleFeature: async (id: string): Promise<Listing> => {
      // First get current status
      const { data: current } = await supabase.from('listings').select('featured').eq('id', id).single();
      if (!current) throw new Error('Not found');

      const { data, error } = await supabase
        .from('listings')
        .update({ featured: !current.featured })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      return mapListing(data);
  }
};
