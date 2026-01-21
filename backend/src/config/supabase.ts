import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Service Role client for Admin operations (User management, bypassing RLS if needed for some reads)
// BE CAREFUL: This client has full database access.
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
