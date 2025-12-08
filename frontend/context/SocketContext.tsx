'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { api } from '@/lib/api';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Only connect if we have a token (user logged in) or logic permits
        // For now, we connect and let the socket handle auth or rooms later
        // Or we can connect once on mount.

        // Ensure we point to the backend URL
        const socketUrl = 'http://localhost:5000'; // Make this env var aware if needed
        const newSocket = io(socketUrl, {
            // options if needed
        });

        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
            setIsConnected(true);

            // Auto-join room based on user role/id if token exists
            const token = localStorage.getItem('token');
            if (token) {
                // We need to decode token or fetch profile to know who we are
                // Alternatively, fetch profile then emit join
                joinRoom(newSocket);
            }
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    const joinRoom = async (s: Socket) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            // We can reuse the profile endpoint or decode JWT here. 
            // For simplicity, let's fetch profile.
            // Note: This might be redundant if we already have user data in a UserContext.
            // But this ensures independent socket logic.

            // Check if vendor or user based on current path or just try both endpoints?
            // Better: Decode token if possible, or just try to get profile.

            // Let's try getting user profile first
            try {
                const user = await api.get<any>('/auth/profile', { 'Authorization': `Bearer ${token}` });
                if (user && user.id) {
                    s.emit('join_room', { type: 'user', id: user.id });
                    return;
                }
            } catch (e) { }

            try {
                const vendor = await api.get<any>('/vendors/profile', { 'Authorization': `Bearer ${token}` });
                if (vendor && vendor.id) {
                    s.emit('join_room', { type: 'vendor', id: vendor.id });
                    return;
                }
            } catch (e) { }

        } catch (error) {
            console.error("Error joining socket room", error);
        }
    }

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
