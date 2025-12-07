"use client";
import { useEffect, useState } from 'react';

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
        // In real app, implement auth token
        fetch('http://localhost:5000/api/admin/stats', {
            headers: {
                'Authorization': 'Bearer YOUR_ADMIN_TOKEN'
            }
        })
            .then((res) => res.json())
            .then((data) => setStats(data))
            .catch((err) => console.error(err));
    }, []);

    if (!stats) return <div className="p-8">Loading stats...</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold text-gray-700">Users</h2>
                    <p className="text-4xl font-bold text-blue-600 mt-2">{stats.users}</p>
                </div>
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold text-gray-700">Vendors</h2>
                    <div className="mt-2">
                        <p className="text-2xl font-bold">Total: {stats.vendors.total}</p>
                        <p className="text-green-600">Active: {stats.vendors.active}</p>
                        <p className="text-orange-600">Pending: {stats.vendors.pending}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold text-gray-700">Jobs</h2>
                    <div className="mt-2">
                        <p className="text-2xl font-bold">Total: {stats.jobs.total}</p>
                        <p className="text-green-600">Completed: {stats.jobs.completed}</p>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
                <a href="/admin/vendors" className="text-blue-600 hover:underline">Manage/Verify Vendors &rarr;</a>
            </div>
        </div>
    );
}
