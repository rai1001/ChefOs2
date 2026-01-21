import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, Loader2, Building2, User, Mail, Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';

const registerSchema = z.object({
    fullName: z.string().min(2, 'Full name is required'),
    organizationName: z.string().min(2, 'Kitchen/Restaurant name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.login);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setError(null);
        try {
            // Register currently creates the user AND org, but doesn't auto-login via API return (MVP limitation in Controller?)
            // Wait, my controller returns { user, organization }. It DOES NOT return a session token immediately unless I changed it.
            // Checking auth.service.ts implementation plan -> it said "Register: Create ...". 
            // The backend `authService.register` returns { user, organization }. It does NOT return a session.
            // So we need to Login immediately after register or prompt user to login.
            // Let's Prompt Login for now or Auto-Login if we had the password.
            // Recommendation: Auto-login is better UX.

            await authService.register(data);

            // Auto-login
            const loginResponse = await authService.login({ email: data.email, password: data.password });
            if (loginResponse.data.session) {
                setAuth(loginResponse.data.session.access_token, loginResponse.data.user);
                navigate('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create account. Please try again.');
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8">
            {/* Background Decor */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute bottom-[20%] left-[10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-3xl" />
            </div>

            <div className="z-10 w-full max-w-md space-y-8">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                        <ChefHat className="h-6 w-6" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tighter text-white">Join ChefOS</h1>
                    <p className="text-slate-400">Initialize your kitchen operation system</p>
                </div>

                <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-xl shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-white">Create Account</CardTitle>
                        <CardDescription className="text-slate-400">
                            Set up your admin profile and organization
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="organizationName" className="text-slate-200">Restaurant / Kitchen Name</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                        <Input
                                            id="organizationName"
                                            placeholder="e.g. Gordon's Grill"
                                            className="pl-9 bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500 focus:border-primary transition-colors"
                                            {...register('organizationName')}
                                        />
                                    </div>
                                    {errors.organizationName && <p className="text-xs text-red-500">{errors.organizationName.message}</p>}
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="fullName" className="text-slate-200">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                        <Input
                                            id="fullName"
                                            placeholder="Chef John Doe"
                                            className="pl-9 bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500 focus:border-primary transition-colors"
                                            {...register('fullName')}
                                        />
                                    </div>
                                    {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="email" className="text-slate-200">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="chef@example.com"
                                            className="pl-9 bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500 focus:border-primary transition-colors"
                                            {...register('email')}
                                        />
                                    </div>
                                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="password" className="text-slate-200">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                        <Input
                                            id="password"
                                            type="password"
                                            className="pl-9 bg-slate-900/50 border-slate-800 text-white focus:border-primary transition-colors"
                                            {...register('password')}
                                        />
                                    </div>
                                    {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
                                    {error}
                                </div>
                            )}

                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all font-medium py-5 mt-2" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Workspace...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t border-slate-800/50 p-6">
                        <p className="text-sm text-slate-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-primary hover:text-primary/80 hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
