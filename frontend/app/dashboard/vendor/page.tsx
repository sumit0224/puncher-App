'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ActiveJobsList from '@/components/dashboard/ActiveJobsList';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { useSocket } from '@/context/SocketContext';

export default function VendorDashboard() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [isOnline, setIsOnline] = useState(false);
    const [vendor, setVendor] = useState<{ name: string; shopName: string; isVerified: boolean } | null>(null);
    const { socket } = useSocket();

    useEffect(() => {
        fetchVendorProfile();
        fetchJobs();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('new_job_request', (job: any) => {
                alert(`New Job Request: ${job.serviceType}`);
                setJobs((prevJobs) => [job, ...prevJobs]);
            });
            return () => {
                socket.off('new_job_request');
            };
        }
    }, [socket]);

    const fetchVendorProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const vendorData = await api.get<any>('/vendors/profile', {
                    'Authorization': `Bearer ${token}`
                });
                setVendor(vendorData);
            }
        } catch (error) {
            console.error("Failed to fetch vendor profile", error);
        }
    };

    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const data = await api.get<any[]>('/requests/vendor', {
                    'Authorization': `Bearer ${token}`
                });
                setJobs(data as any);
            }
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        }
    };

    const toggleStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            const newStatus = !isOnline;

            if (token && newStatus) {
                await api.put('/vendors/location', { lat: 12.9716, long: 77.5946 }, {
                    'Authorization': `Bearer ${token}`
                });
            }

            const data = await api.put<{ isActive: boolean }>('/vendors/status', {}, {
                'Authorization': `Bearer ${token}`
            });
            setIsOnline(data.isActive);

        } catch (error) {
            console.error("Failed to toggle status", error);
            alert("Failed to toggle status");
        }
    };

    const acceptJob = async (jobId: string) => {
        try {
            const token = localStorage.getItem('token');
            await api.post(`/requests/${jobId}/accept`, {}, {
                'Authorization': `Bearer ${token}`
            });
            alert("Job Accepted!");
            fetchJobs();
        } catch (error) {
            console.error(error);
            alert("Failed to accept job");
        }
    };

    return (
        <DashboardLayout role="vendor">
            <div className="space-y-8 text-black">
                <Card className={`${isOnline ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl font-bold">{vendor?.shopName || 'My Shop'}</h1>
                                {vendor?.isVerified && (
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Verified</span>
                                )}
                            </div>
                            <h2 className="text-xl font-bold">Status: <span className={isOnline ? 'text-green-600' : 'text-gray-500'}>{isOnline ? 'ONLINE' : 'OFFLINE'}</span></h2>
                            <p className="text-sm text-gray-600">{isOnline ? 'You are visible to customers nearby.' : 'Go online to start receiving job requests.'}</p>
                        </div>
                        <Button
                            size="lg"
                            variant={isOnline ? 'destructive' : 'default'}
                            className={isOnline ? '' : 'bg-green-600 hover:bg-green-700 text-white'}
                            onClick={toggleStatus}
                        >
                            {isOnline ? 'Go Offline' : 'Go Online'}
                        </Button>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Incoming Requests / Active Jobs</h3>
                        <ActiveJobsList jobs={jobs} userType="vendor" />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
