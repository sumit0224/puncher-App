'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    image?: React.ReactNode;
}

export default function AuthLayout({ children, title, subtitle, image }: AuthLayoutProps) {
    return (
        <div className="min-h-screen w-full flex bg-white overflow-hidden">
            {/* Left Side - Hero / Branding */}
            <div className="hidden lg:flex w-1/2 bg-black text-white relative flex-col justify-between p-12">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-yellow-400/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

                {/* Logo */}
                <Link href="/" className="relative z-10 flex items-center gap-2 w-max">
                    <div className="bg-yellow-400 p-1.5 rounded-lg">
                        <Zap className="text-black w-6 h-6" fill="black" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white">
                        PUNCHER
                    </span>
                </Link>

                {/* Main Text Content */}
                <div className="relative z-10 space-y-6 max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <h1 className="text-5xl font-black tracking-tight leading-tight">
                            {title}
                        </h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-xl text-gray-400 font-medium"
                    >
                        {subtitle}
                    </motion.p>
                </div>

                {/* Footer/Copyright */}
                <div className="relative z-10 text-sm text-gray-600 font-medium">
                    &copy; {new Date().getFullYear()} Puncher Technologies.
                </div>
            </div>

            {/* Right Side - Form Container */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                {/* Mobile Logo (Visible only on small screens) */}
                <div className="absolute top-6 left-6 lg:hidden">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-yellow-400 p-1.5 rounded-lg">
                            <Zap className="text-black w-5 h-5" fill="black" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-black">
                            PUNCHER
                        </span>
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md w-full"
                >
                    {children}
                </motion.div>
            </div>
        </div>
    );
}
