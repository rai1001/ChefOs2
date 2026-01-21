import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.login);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setError(null);
        try {
            const response = await authService.login(data);
            if (response.data.session) {
                setAuth(response.data.session.access_token, response.data.user);
                navigate('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
            {/* Background Decor */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute top-[40%] -right-[10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />
            </div>

            <div className="z-10 w-full max-w-md space-y-8">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                        <ChefHat className="h-6 w-6" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tighter text-white">ChefOS</h1>
                    <p className="text-slate-400">Operating System for Modern Kitchens</p>
                </div>

                <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-xl shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-white">Welcome back</CardTitle>
                        <CardDescription className="text-slate-400">
                            Enter your credentials to access your workspace
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-200">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="chef@restaurant.com"
                                    className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500 hover:border-slate-700 focus:border-primary transition-colors"
                                    {...register('email')}
                                />
                                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-slate-200">Password</Label>
                                    <Link to="/forgot-password" className="text-xs text-primary hover:text-primary/80 hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    className="bg-slate-900/50 border-slate-800 text-white hover:border-slate-700 focus:border-primary transition-colors"
                                    {...register('password')}
                                />
                                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                            </div>

                            {error && (
                                <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
                                    {error}
                                </div>
                            )}

                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all font-medium py-5" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t border-slate-800/50 p-6">
                        <p className="text-sm text-slate-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-semibold text-primary hover:text-primary/80 hover:underline">
                                Start Free Trial
                            </Link>
                        </p>
                    </CardFooter>
                </Card>

                <p className="text-center text-xs text-slate-500">
                    By clicking continue, you agree to our{' '}
                    <a href="#" className="underline hover:text-slate-400">Terms of Service</a> and{' '}
                    <a href="#" className="underline hover:text-slate-400">Privacy Policy</a>
                    .
                </p>
            </div>
        </div>
    );
}
