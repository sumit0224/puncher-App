'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import AuthLayout from '@/components/auth/AuthLayout';
import { Loader2 } from 'lucide-react';

export default function UserLogin() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        phone: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response: any = await api.post('/auth/login/user', formData);

            localStorage.setItem('token', response.token);
            // The login response might be top-level properties or nested in 'user'
            // Based on backend: res.json({ id, name, phone, email, token })
            // So we construct the user object from the response directly (excluding token)
            localStorage.setItem('user', JSON.stringify({
                id: response.id,
                name: response.name,
                email: response.email,
                phone: response.phone
            }));

            router.push('/dashboard/user');
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome Back."
            subtitle="Login to access your dashboard and request assistance."
        >
            <div className="space-y-6">
                <div className="space-y-2 text-center lg:text-left">
                    <h2 className="text-3xl font-bold tracking-tight">Login</h2>
                    <p className="text-gray-500">Enter your phone number and password.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="phone">
                            Phone Number
                        </label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="9876543210"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="h-12 bg-gray-50 border-gray-200 focus:ring-yellow-400 focus:border-yellow-400"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                                Password
                            </label>
                            {/* Forgot Password Link could go here */}
                        </div>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="h-12 bg-gray-50 border-gray-200 focus:ring-yellow-400 focus:border-yellow-400"
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full h-12 text-base font-bold bg-yellow-400 text-black hover:bg-yellow-500 rounded-lg shadow-md transition-transform hover:scale-[1.02]"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
                            </>
                        ) : 'Login'}
                    </Button>
                </form>

                <div className="text-center text-sm">
                    <span className="text-gray-500">Don't have an account? </span>
                    <Link href="/register/user" className="font-bold text-black hover:text-yellow-500 hover:underline">
                        Sign up
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
