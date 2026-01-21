import { supabase } from '@/config/supabase';
import { AppError } from '@/middleware/error.middleware';

export class AuthService {
    /**
     * Register a new User and Organization.
     * This is a multi-step transaction-like process.
     */
    async register(data: { email: string; password: string; fullName: string; organizationName: string }) {
        // 1. Create Auth User
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: data.email,
            password: data.password,
            email_confirm: true, // Auto-confirm for now (MVP)
            user_metadata: { full_name: data.fullName }
        });

        if (authError) throw new AppError(400, authError.message);
        if (!authData.user) throw new AppError(500, 'Failed to create user');

        const userId = authData.user.id;

        try {
            // 2. Create Organization
            const { data: org, error: orgError } = await supabase
                .from('organizations')
                .insert({ name: data.organizationName, plan: 'FREE' })
                .select()
                .single();

            if (orgError) throw orgError;

            // 3. Create Public User Profile
            // Note: Triggers might handle this in some setups, but we do it explicit for MVP control
            const { error: profileError } = await supabase
                .from('users')
                .insert({
                    id: userId,
                    email: data.email,
                    full_name: data.fullName
                });

            if (profileError) throw profileError;

            // 4. Link User to Org as ADMIN
            const { error: memberError } = await supabase
                .from('organization_members')
                .insert({
                    user_id: userId,
                    organization_id: org.id,
                    role: 'ORG_ADMIN'
                });

            if (memberError) throw memberError;

            return { user: { id: userId, email: data.email }, organization: org };

        } catch (error: any) {
            // Rollback: Delete auth user if DB setup fails
            await supabase.auth.admin.deleteUser(userId);
            throw new AppError(500, 'Registration failed: ' + error.message);
        }
    }

    async login(data: { email: string; password: string }) {
        const { data: authData, error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password
        });

        if (error) throw new AppError(401, 'Invalid credentials');

        return {
            session: authData.session,
            user: authData.user
        };
    }
}

export const authService = new AuthService();
