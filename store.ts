import { create } from 'zustand';
import { User, Listing, PremiumStatus } from './types';
import { authService } from './services/authService';
import { listingService } from './services/listingService';
import { supabase } from './lib/supabase';

interface AppState {
  user: User | null;
  listings: Listing[];
  allUsers: User[]; // For admin management
  isLoading: boolean;
  error: string | null;
  
  // Actions
  checkSession: () => Promise<void>;
  login: (username: string, password?: string) => Promise<User | undefined>;
  register: (username: string, password: string, email: string, adminSecret?: string) => Promise<User | undefined>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  applyForPremium: () => Promise<void>;
  logout: () => void;
  fetchListings: () => Promise<void>;
  addListing: (listing: Listing) => void;
  updateListingInStore: (listing: Listing) => void;
  removeListingFromStore: (id: string) => void;
  clearError: () => void;
  
  // Admin Actions
  fetchAllUsers: () => Promise<void>;
  toggleUserVerification: (id: string) => Promise<void>;
  setPremiumStatus: (id: string, status: PremiumStatus) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  listings: [],
  allUsers: [],
  isLoading: false,
  error: null,

  checkSession: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const user = await authService.getUserProfile(session.user.id);
        set({ user });
      }
    } catch (e) {
      console.error("Session check failed", e);
    }
  },

  login: async (username, password) => {
    // Username is effectively Email in this Supabase setup
    set({ isLoading: true, error: null });
    try {
      const user = await authService.login(username, password);
      set({ user, isLoading: false });
      return user;
    } catch (e: any) {
      set({ isLoading: false, error: e.message || 'LOGIN_FAILED' });
      return undefined;
    }
  },

  register: async (username, password, email, adminSecret) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.register(username, password, email, adminSecret);
      set({ user, isLoading: false });
      return user;
    } catch (e: any) {
      set({ isLoading: false, error: e.message || 'REGISTRATION_FAILED' });
      return undefined;
    }
  },

  updateProfile: async (data) => {
    const currentUser = get().user;
    if (!currentUser) return;
    set({ isLoading: true });
    try {
      const updated = await authService.updateProfile(currentUser.id, data);
      set({ user: updated, isLoading: false });
    } catch (e) {
       set({ isLoading: false });
    }
  },

  applyForPremium: async () => {
    const currentUser = get().user;
    if (!currentUser) return;
    set({ isLoading: true });
    try {
      const updated = await authService.applyForPremium(currentUser.id);
      set({ user: updated, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, allUsers: [] });
  },

  fetchListings: async () => {
    set({ isLoading: true });
    try {
      const listings = await listingService.getAll();
      set({ listings, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  addListing: (listing) => set((state) => ({ listings: [listing, ...state.listings] })),
  
  updateListingInStore: (updated) => set((state) => ({
    listings: state.listings.map(l => l.id === updated.id ? updated : l)
  })),

  removeListingFromStore: (id) => set((state) => ({
    listings: state.listings.filter(l => l.id !== id)
  })),

  clearError: () => set({ error: null }),

  // Admin Actions
  fetchAllUsers: async () => {
    try {
       const allUsers = await authService.getAllUsers();
       set({ allUsers });
    } catch (e) {
       console.error("Failed to fetch users");
    }
  },

  toggleUserVerification: async (id) => {
    try {
      const updatedUser = await authService.toggleUserVerification(id);
      set(state => ({
        allUsers: state.allUsers.map(u => u.id === id ? updatedUser : u),
        user: state.user?.id === id ? updatedUser : state.user
      }));
    } catch (e) {
      console.error("Failed to toggle verification");
    }
  },

  setPremiumStatus: async (id, status) => {
    try {
      const updatedUser = await authService.managePremiumStatus(id, status);
      set(state => ({
        allUsers: state.allUsers.map(u => u.id === id ? updatedUser : u),
        user: state.user?.id === id ? updatedUser : state.user
      }));
    } catch (e) {
      console.error("Failed to set premium status");
    }
  }
}));
