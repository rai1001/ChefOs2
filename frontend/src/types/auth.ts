export interface User {
    id: string;
    email: string;
    full_name?: string;
    organizationIds: string[];
    role?: string;
}

export interface AuthResponse {
    status: string;
    data: {
        user: User;
        session?: {
            access_token: string;
            refresh_token: string;
        };
        organization?: any;
    };
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    fullName: string;
    organizationName: string;
}
