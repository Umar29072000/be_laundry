import { createClient } from '@supabase/supabase-js';
import { env } from './env';

/**
 * Supabase client menggunakan service_role key agar dapat mengakses storage
 * tanpa dibatasi oleh RLS (Row Level Security).
 * JANGAN expose key ini ke frontend / client-side.
 */
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
