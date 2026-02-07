import { createClient } from '@supabase/supabase-js';

// Configuration for Vercel Deployment
// Keys are loaded from import.meta.env (Vite standard)
// Fallbacks provided for immediate development use

// Safely access env to avoid runtime crash if import.meta.env is undefined
const env = (import.meta as any).env || {};

const supabaseUrl = env.VITE_SUPABASE_URL || 'https://xhqikumctlflggzvuyfj.supabase.co';
const supabaseKey = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocWlrdW1jdGxmbGdnenZ1eWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NDg2ODYsImV4cCI6MjA4NjAyNDY4Nn0.Slt5OKonnfx9Ht2TagPUGX2FoO8BGGogV3FNl5zuiPg';

export const supabase = createClient(supabaseUrl, supabaseKey);