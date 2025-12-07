'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface Job {
    id: number;
    serviceType: string;
    status: string;
    priceEstimate?: number;
    location: string;
    createdAt: string;
    vendor?: {
        name: string;
        phone: string;
    }
}

interface ActiveJobsListProps {
    jobs: Job[];
    userType: 'user' | 'vendor';
}

export default function ActiveJobsList({ jobs, userType }: ActiveJobsListProps) {
    if (jobs.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                No active jobs found.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {jobs.map((job) => (
                <Card key={job.id} className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h4 className="font-bold text-lg">{job.serviceType}</h4>
                            <p className="text-sm text-gray-600">Location: {job.location}</p>
                            <p className="text-xs text-gray-400 mt-1">Requested: {new Date(job.createdAt).toLocaleString()}</p>
                            {userType === 'user' && job.vendor && (
                                <div className="mt-2 text-sm bg-green-50 text-green-700 px-2 py-1 rounded inline-block">
                                    Mechanic: <strong>{job.vendor.name}</strong> ({job.vendor.phone})
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${job.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                    job.status === 'Requested' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-blue-100 text-blue-800'
                                }`}>
                                {job.status}
                            </span>
                            {job.priceEstimate && (
                                <span className="font-medium text-lg">₹{job.priceEstimate}</span>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
