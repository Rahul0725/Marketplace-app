import { User, PremiumStatus } from '../types';
import { supabase } from '../lib/supabase';

const ADMIN_SECRET = "nexus-admin";

// Helper to map DB profile to App User
const mapProfile = (profile: any): User => ({
  id: profile.id,
  username: profile.username,
  role: profile.role,
  avatarUrl: profile.avatar_url,
  isVerified: profile.is_verified,
  premiumStatus: profile.premium_status,
  email: profile.email,
  bio: profile.bio,
  joinedAt: profile.joined_at,
});

export const authService = {
  login: async (email: string, password?: string): Promise<User> => {
    // 1. Auth with Supabase
    if (!password) throw new Error("Password required");
    
    // Attempt to sign in (username here is treated as email for Supabase auth usually, 
    // unless you implemented username login. Assuming email for auth)
    // If the input is not an email, this might fail, but let's assume valid email for now.
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email, 
      password: password
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error('USER_NOT_FOUND');

    // 2. Fetch Profile details
    return authService.getUserProfile(authData.user.id);
  },

  register: async (username: string, password: string, email: string, adminSecret?: string): Promise<User> => {
    // 1. Sign up
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error('REGISTRATION_FAILED');

    // 2. Create Profile
    const role = adminSecret === ADMIN_SECRET ? 'admin' : 'user';
    const isVerified = adminSecret === ADMIN_SECRET;
    const premiumStatus = adminSecret === ADMIN_SECRET ? 'approved' : 'none';
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    const newProfile = {
      id: authData.user.id,
      username,
      email,
      role,
      is_verified: isVerified,
      premium_status: premiumStatus,
      avatar_url: avatarUrl,
      bio: 'New member of the Nexus.',
      joined_at: new Date().toISOString()
    };

    const { error: profileError } = await supabase
      .from('profiles')
      .insert([newProfile]);

    if (profileError) {
      console.error(profileError);
      // Fallback: Return object locally even if DB insert fails slightly (should handle better in prod)
    }

    return mapProfile(newProfile);
  },
  
  getUserProfile: async (userId: string): Promise<User> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error || !data) throw new Error('PROFILE_NOT_FOUND');
    return mapProfile(data);
  },

  updateProfile: async (id: string, data: Partial<User>): Promise<User> => {
    const updates: any = {};
    if (data.bio !== undefined) updates.bio = data.bio;
    if (data.email !== undefined) updates.email = data.email;
    if (data.avatarUrl !== undefined) updates.avatar_url = data.avatarUrl;

    const { data: updated, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapProfile(updated);
  },

  applyForPremium: async (id: string): Promise<User> => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ premium_status: 'pending' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapProfile(data);
  },

  getAllUsers: async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
      
    if (error) throw new Error(error.message);
    return data.map(mapProfile);
  },

  toggleUserVerification: async (id: string): Promise<User> => {
    // First get current status
    const { data: current } = await supabase.from('profiles').select('is_verified').eq('id', id).single();
    if (!current) throw new Error('User not found');

    const { data, error } = await supabase
      .from('profiles')
      .update({ is_verified: !current.is_verified })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapProfile(data);
  },

  managePremiumStatus: async (id: string, status: PremiumStatus): Promise<User> => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ premium_status: status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapProfile(data);
  },
  
  logout: async (): Promise<void> => {
    await supabase.auth.signOut();
  }
};
