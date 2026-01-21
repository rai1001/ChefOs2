export interface UserProfile {
    id: string;
    email: string;
    full_name?: string;
}

export interface AuthUser extends UserProfile {
    organizationIds: string[];
    role?: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}
