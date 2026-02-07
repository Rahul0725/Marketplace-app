export type Role = 'user' | 'admin';
export type PremiumStatus = 'none' | 'pending' | 'approved';

export interface User {
  id: string;
  username: string;
  role: Role;
  avatarUrl?: string;
  isVerified: boolean; // Basic identity verification
  premiumStatus: PremiumStatus; // Premium Seller Application Status
  // Auth & Profile
  password?: string; 
  email?: string;
  bio?: string;
  joinedAt?: string;
}

export interface Listing {
  id: string;
  ownerId: string;
  title: string;
  level: number;
  likes: number;
  region: string;
  loginMethod: string;
  price: number;
  status: 'available' | 'reserved' | 'sold';
  accountAge: string;
  primeLevel: string;
  vaultCount: number;
  
  // Collections
  bundles: string[];
  evoGuns: string[];
  elitePasses: string[];
  rarityTags: string[];
  
  // Stats
  gunVaultCount: number;
  dressVaultCount: number;
  glooWallCount: number;
  emotesCount: number;
  animationCount: number;
  
  // Highlights
  highlights: string[];
  
  // Contact
  contactUsername: string;
  proofLink: string;
  paymentMethods: string[];
  
  // Media
  images: string[];
  
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ListingFormData = Omit<Listing, 'id' | 'ownerId' | 'featured' | 'createdAt' | 'updatedAt'>;

export const DEFAULT_LISTING_FORM: ListingFormData = {
  title: '',
  level: 1,
  likes: 0,
  region: 'NA',
  loginMethod: 'Google',
  price: 0,
  status: 'available',
  accountAge: '1 Year',
  primeLevel: 'None',
  vaultCount: 0,
  bundles: [],
  evoGuns: [],
  elitePasses: [],
  rarityTags: [],
  gunVaultCount: 0,
  dressVaultCount: 0,
  glooWallCount: 0,
  emotesCount: 0,
  animationCount: 0,
  highlights: [],
  contactUsername: '',
  proofLink: '',
  paymentMethods: ['PayPal', 'Crypto'],
  images: [],
};