"use client";
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Vendor {
    id: number;
    name: string;
    phone: string;
    shopName: string;
}

export default function VendorManagement() {
    const [vendors, setVendors] = useState<Vendor[]>([]);

    const fetchVendors = () => {
        api.get<Vendor[]>('/admin/vendors?status=pending', {
            'Authorization': 'Bearer YOUR_ADMIN_TOKEN' // In real app, use auth context
        })
            .then((data) => setVendors(data))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const verifyVendor = (id: number) => {
        api.put(`/admin/vendors/${id}/verify`, { isVerified: true }, {
            'Authorization': 'Bearer YOUR_ADMIN_TOKEN'
        })
            .then(() => {
                alert('Vendor Verified!');
                fetchVendors(); // Refresh list
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Vendor Verification</h1>
            <a href="/admin" className="text-blue-600 mb-4 inline-block">&larr; Back to Dashboard</a>

            <div className="bg-white rounded shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 text-left">Name</th>
                            <th className="py-3 px-4 text-left">Phone</th>
                            <th className="py-3 px-4 text-left">Shop</th>
                            <th className="py-3 px-4 text-left">Status</th>
                            <th className="py-3 px-4 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.map(vendor => (
                            <tr key={vendor.id} className="border-t">
                                <td className="py-3 px-4">{vendor.name}</td>
                                <td className="py-3 px-4">{vendor.phone}</td>
                                <td className="py-3 px-4">{vendor.shopName}</td>
                                <td className="py-3 px-4">
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">Pending</span>
                                </td>
                                <td className="py-3 px-4">
                                    <button
                                        onClick={() => verifyVendor(vendor.id)}
                                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                    >
                                        Verify
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {vendors.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-500">No pending vendors found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
