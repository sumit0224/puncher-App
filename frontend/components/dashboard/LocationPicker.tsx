/// <reference types="@types/google.maps" />
'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { Button } from '@/components/ui/Button';

const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.5rem',
};

const defaultCenter = {
    lat: 12.9716, // Bangalore default
    lng: 77.5946,
};

interface LocationPickerProps {
    onLocationSelect: (location: { lat: number; lng: number; address?: string }) => void;
    initialLat?: number;
    initialLng?: number;
}

export default function LocationPicker({ onLocationSelect, initialLat, initialLng }: LocationPickerProps) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '', // Make sure to add this to .env.local
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [center, setCenter] = useState(defaultCenter);
    const centerRef = useRef(defaultCenter); // To track center without re-rendering too often if needed

    // Try to get user location on mount
    useEffect(() => {
        if (initialLat && initialLng) {
            setCenter({ lat: initialLat, lng: initialLng });
        } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userPos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setCenter(userPos);
                    if (onLocationSelect) {
                        onLocationSelect(userPos);
                    }
                },
                () => {
                    // Handle location error if needed
                }
            );
        }
    }, [initialLat, initialLng]);

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map: google.maps.Map) {
        setMap(null);
    }, []);

    const onDragEnd = useCallback(() => {
        if (map) {
            const newCenter = map.getCenter();
            if (newCenter) {
                const lat = newCenter.lat();
                const lng = newCenter.lng();
                centerRef.current = { lat, lng };
                onLocationSelect({ lat, lng });
                // Optional: Call Geocoding API here to get address
            }
        }
    }, [map, onLocationSelect]);

    if (!isLoaded) {
        return <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-400">Loading Map...</div>;
    }

    return (
        <div className="relative w-full">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={15}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onDragEnd={onDragEnd}
                options={{
                    disableDefaultUI: true, // Cleaner, Ola-like look
                    zoomControl: true,
                }}
            >
                {/* Child components, such as markers, info windows, etc. */}
            </GoogleMap>

            {/* Fixed Pin at Center */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
                <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-primary drop-shadow-md"
                >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor" opacity="0.9" />
                    <circle cx="12" cy="9" r="2.5" fill="white" />
                </svg>
                <div className="w-2 h-2 bg-black/50 rounded-full blur-[2px] mx-auto mt-[-4px]"></div> { /* Shadow */}
            </div>

            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg text-sm text-center">
                Drag map to set location
            </div>
        </div>
    );
}
