'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface DashboardLayoutProps {
    children: ReactNode;
    role: 'user' | 'vendor'; // 'admin' could be added later
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
    const router = useRouter();

    const handleLogout = () => {
        // Clear token 
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // or vendor
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Navbar - Uber/Ola style dark header */}
            <header className="bg-black text-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2 group">
                            <span className="text-2xl font-black tracking-tighter text-yellow-400 group-hover:text-yellow-300 transition-colors">
                                PUNCHER
                            </span>
                        </Link>
                        <span className="ml-3 px-2 py-0.5 bg-yellow-400 text-black text-[10px] font-bold uppercase tracking-widest rounded-sm">
                            {role}
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" onClick={handleLogout} className="text-sm font-bold text-gray-300 hover:text-white hover:bg-white/10 h-9">
                            LOGOUT
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {children}
            </main>

            {/* Simple Footer */}
            <footer className="bg-white border-t border-gray-100 mt-auto">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-400 uppercase tracking-widest font-semibold">
                    &copy; {new Date().getFullYear()} Puncher App
                </div>
            </footer>
        </div>
    );
}
