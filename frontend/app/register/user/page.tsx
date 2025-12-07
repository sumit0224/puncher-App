'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import AuthLayout from '@/components/auth/AuthLayout';
import { Loader2 } from 'lucide-react';

export default function RegisterUser() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
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
            const response: any = await api.post('/auth/register/user', formData);

            // Auto-login: Save token and user data
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify({
                id: response.id,
                name: response.name,
                email: response.email,
                phone: response.phone
            }));

            router.push('/dashboard/user');
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Join the Network."
            subtitle="Create your account to request roadside assistance instantly."
        >
            <div className="space-y-6">
                <div className="space-y-2 text-center lg:text-left">
                    <h2 className="text-3xl font-bold tracking-tight">Create Account</h2>
                    <p className="text-gray-500">Enter your details to get started.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="name">
                            Full Name
                        </label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="h-12 bg-gray-50 border-gray-200 focus:ring-yellow-400 focus:border-yellow-400"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                            Email (Optional)
                        </label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="h-12 bg-gray-50 border-gray-200 focus:ring-yellow-400 focus:border-yellow-400"
                        />
                    </div>

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
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                            Password
                        </label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Create a secure password"
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
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...
                            </>
                        ) : 'Sign Up'}
                    </Button>
                </form>

                <div className="text-center text-sm">
                    <span className="text-gray-500">Already have an account? </span>
                    <Link href="/login/user" className="font-bold text-black hover:text-yellow-500 hover:underline">
                        Login here
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
