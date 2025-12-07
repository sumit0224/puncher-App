'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { api } from '@/lib/api';
import LocationPicker from './LocationPicker';

const SERVICE_TYPES = [
    'Puncture Repair',
    'Towing',
    'Battery Jumpstart',
    'Fuel Delivery',
    'General Mechanic',
];

export default function ServiceRequestForm({ onSuccess }: { onSuccess: () => void }) {
    const [selectedService, setSelectedService] = useState(SERVICE_TYPES[0]);
    const [location, setLocation] = useState('');
    const [showMap, setShowMap] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // User ID should be handled by backend via token context, but we need to ensure token is sent.
            // The api helper handles headers if we set them globally or pass them. 
            // For now, assuming token is attached or handled by the wrapper if we add interceptors.
            // Wait, the current api.ts doesn't automatically attach tokens. We need to handle that.
            // Let's assume for this component we retrieve token from localStorage for now.
            const token = localStorage.getItem('token');

            await api.post('/requests', {
                serviceType: selectedService,
                location: location || '0,0', // Fallback
                priceEstimate: 50.0 // Mock estimate
            }, {
                'Authorization': `Bearer ${token}`
            });

            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Failed to submit request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-primary/20 shadow-md">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Request Assistance</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Service Type</label>
                        <select
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                        >
                            {SERVICE_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Location</label>
                        {showMap ? (
                            <div className="space-y-2">
                                <LocationPicker
                                    onLocationSelect={(loc) => setLocation(`${loc.lat.toFixed(6)},${loc.lng.toFixed(6)}`)}
                                />
                                <Button type="button" variant="outline" onClick={() => setShowMap(false)} className="w-full">
                                    Confirm Location
                                </Button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Input
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Select location on map"
                                    required
                                    readOnly
                                />
                                <Button type="button" variant="outline" onClick={() => setShowMap(true)}>
                                    📍 Change
                                </Button>
                            </div>
                        )}
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button type="submit" className="w-full" variant="premium" disabled={loading || !location}>
                        {loading ? 'Finding Mechanic...' : 'Request Now'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
