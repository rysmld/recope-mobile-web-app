import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const supabaseUrl = 'https://kdhfjzwosljwrxhieycy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkaGZqendvc2xqd3J4aGlleWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNjMyMzAsImV4cCI6MjA5MjkzOTIzMH0.qrV30XIs4FkfmcVne-yx1eDfOKNfgoMnceT-Iqfoo9s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});