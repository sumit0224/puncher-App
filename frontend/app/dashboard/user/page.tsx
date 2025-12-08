'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ServiceRequestForm from '@/components/dashboard/ServiceRequestForm';
import ActiveJobsList from '@/components/dashboard/ActiveJobsList';
import { api } from '@/lib/api';
import { useSocket } from '@/context/SocketContext';

export default function UserDashboard() {
    const [jobs, setJobs] = useState([]);
    const [user, setUser] = useState<{ name: string } | null>(null);

    const { socket } = useSocket();

    useEffect(() => {
        fetchUserProfile();
        fetchJobs();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('job_assigned', (job: any) => {
                alert(`Good news! A mechanic has accepted your request: ${job.serviceType}`);
                fetchJobs(); // Update the list
            });

            socket.on('job_status_update', (job: any) => {
                alert(`Update on your request: Status is now ${job.status}`);
                fetchJobs();
            });

            return () => {
                socket.off('job_assigned');
                socket.off('job_status_update');
            };
        }
    }, [socket]);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const userData = await api.get<any>('/auth/profile', {
                    'Authorization': `Bearer ${token}`
                });
                setUser(userData);
            }
        } catch (error) {
            console.error("Failed to fetch user profile", error);
        }
    };

    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const data = await api.get<any[]>('/requests/user', {
                    'Authorization': `Bearer ${token}`
                });
                setJobs(data as any);
            }
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        }
    };

    return (
        <DashboardLayout role="user">
            <div className="grid grid-cols-1 text-black lg:grid-cols-3 gap-8">
                {/* Left Column: Request Service */}
                <div className="lg:col-span-1 space-y-6">
                    <h2 className="text-2xl font-bold">New Request</h2>
                    <ServiceRequestForm onSuccess={fetchJobs} />
                </div>

                {/* Right Column: Active Status */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold">Your Activity</h2>
                    <ActiveJobsList jobs={jobs} userType="user" />
                </div>
            </div>
        </DashboardLayout>
    );
}
