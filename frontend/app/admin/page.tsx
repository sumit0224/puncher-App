"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Users, Wrench, Briefcase, CheckCircle, AlertCircle, Clock, Zap } from "lucide-react";

interface DashboardStats {
    users: number;
    vendors: {
        total: number;
        active: number;
        pending: number;
    };
    jobs: {
        total: number;
        completed: number;
    };
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);

    useEffect(() => {
        // Mock data fallback for UI verification if API fails or is not ready
        const mockStats = {
            users: 1254,
            vendors: { total: 85, active: 62, pending: 23 },
            jobs: { total: 450, completed: 412 }
        };

        // In real app, implement auth token
        fetch('http://localhost:5000/api/admin/stats', {
            headers: {
                'Authorization': 'Bearer YOUR_ADMIN_TOKEN'
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch");
                return res.json();
            })
            .then((data) => setStats(data))
            .catch((err) => {
                console.error(err);
                setStats(mockStats); // Fallback for demo
            });
    }, []);

    if (!stats) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">Loading Dashboard...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Admin Header */}
            <header className="bg-black text-white py-4 px-8 shadow-md border-b border-gray-800">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-yellow-400 p-1 rounded">
                            <Zap className="w-5 h-5 text-black" fill="black" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">Puncher <span className="text-yellow-400">Admin</span></h1>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
                        <span>Welcome, Administrator</span>
                        <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold border border-gray-700">A</div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-8 space-y-8">

                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Overview</h2>
                    <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">
                        Last updated: Just now
                    </span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Users Card */}
                    <Card className="border-t-4 border-t-blue-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{stats.users.toLocaleString()}</div>
                            <p className="text-xs text-gray-500 mt-1">Registered accounts</p>
                        </CardContent>
                    </Card>

                    {/* Vendors Card */}
                    <Card className="border-t-4 border-t-yellow-400 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Mechanic Partners</CardTitle>
                            <Wrench className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{stats.vendors.total}</div>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center text-green-600 gap-1"><CheckCircle className="w-3 h-3" /> Active</span>
                                    <span className="font-bold">{stats.vendors.active}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center text-orange-600 gap-1"><Clock className="w-3 h-3" /> Pending</span>
                                    <span className="font-bold">{stats.vendors.pending}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Jobs Card */}
                    <Card className="border-t-4 border-t-green-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Service Requests</CardTitle>
                            <Briefcase className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{stats.jobs.total}</div>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center text-green-600 gap-1"><CheckCircle className="w-3 h-3" /> Completed</span>
                                    <span className="font-bold">{stats.jobs.completed}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center text-gray-500 gap-1">Completion Rate</span>
                                    <span className="font-bold">{Math.round((stats.jobs.completed / stats.jobs.total) * 100) || 0}%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions / Tables Placeholder */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Actions</CardTitle>
                            <CardDescription>Latest system activities</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <p className="text-sm text-gray-600">New user registration <span className="font-bold text-gray-900">#User{1000 + i}</span></p>
                                    <span className="ml-auto text-xs text-gray-400">2m ago</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Management</CardTitle>
                            <CardDescription>Quick links to manage entities</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <a href="/admin/vendors" className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="bg-yellow-100 p-2 rounded-md group-hover:bg-yellow-200 transition-colors">
                                        <Wrench className="w-5 h-5 text-yellow-700" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">Verify Vendors</p>
                                        <p className="text-xs text-gray-500">Review pending applications</p>
                                    </div>
                                </div>
                                <AlertCircle className="w-5 h-5 text-orange-500" />
                            </a>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
