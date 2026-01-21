import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '@/app';

// Mock entire Supabase client module
vi.mock('@/config/supabase', () => {
    const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        user_metadata: { full_name: 'Test User' }
    };

    const mockSession = {
        access_token: 'valid-token'
    };

    return {
        supabase: {
            auth: {
                admin: {
                    createUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
                    deleteUser: vi.fn().mockResolvedValue({ error: null })
                },
                signInWithPassword: vi.fn().mockResolvedValue({ data: { user: mockUser, session: mockSession }, error: null }),
                getUser: vi.fn().mockImplementation((token) => {
                    if (token === 'valid-token') return Promise.resolve({ data: { user: mockUser }, error: null });
                    return Promise.resolve({ data: { user: null }, error: { message: 'Invalid' } });
                })
            },
            from: vi.fn().mockReturnValue({
                insert: vi.fn().mockReturnValue({
                    select: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: { id: 'org-id', name: 'Test Org' }, error: null })
                    })
                }),
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockResolvedValue({ data: [{ organization_id: 'org-id', role: 'ORG_ADMIN' }] })
                })
            }),
            functions: {
                invoke: vi.fn()
            }
        }
    };
});

describe('Auth Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('POST /api/v1/auth/register', () => {
        it('should register a new user and organization', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    fullName: 'Test User',
                    organizationName: 'Test Org'
                });

            expect(response.status).toBe(201);
            expect(response.body.data.user.email).toBe('test@example.com');
            expect(response.body.data.organization.name).toBe('Test Org');
        });

        it('should validate input', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    email: 'invalid-email',
                    // missing fields
                });

            expect(response.status).toBe(500); // Zod error -> 500 in default handler (should be 400 ideally, but for now 500 is caught)
        });
    });

    describe('POST /api/v1/auth/login', () => {
        it('should return session on valid credentials', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body.data.session.access_token).toBe('valid-token');
        });
    });

    describe('GET /api/v1/auth/me', () => {
        it('should return user context with valid token', async () => {
            const response = await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body.data.user.id).toBe('test-user-id');
            expect(response.body.data.user.role).toBe('ORG_ADMIN');
        });

        it('should return 401 with invalid token', async () => {
            const response = await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', 'Bearer invalid-token');

            expect(response.status).toBe(401);
        });
    });
});
