import { create } from 'zustand';
import { User } from '@/types/auth';
import { authService } from '@/services/auth.service';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    login: (token: string, user: User) => {
        localStorage.setItem('auth_token', token);
        set({ user, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem('auth_token');
        set({ user: null, isAuthenticated: false });
    },

    checkAuth: async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            set({ isLoading: false, isAuthenticated: false, user: null });
            return;
        }

        try {
            const response = await authService.me();
            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false
            });
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('auth_token');
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false
            });
        }
    }
}));
