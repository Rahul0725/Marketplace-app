import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xhqikumctlflggzvuyfj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocWlrdW1jdGxmbGdnenZ1eWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NDg2ODYsImV4cCI6MjA4NjAyNDY4Nn0.Slt5OKonnfx9Ht2TagPUGX2FoO8BGGogV3FNl5zuiPg';

export const supabase = createClient(supabaseUrl, supabaseKey);
