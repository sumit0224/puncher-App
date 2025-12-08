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
        const socketUrl = process.env.NEXT_PUBLIC_API_URL ? new URL(process.env.NEXT_PUBLIC_API_URL).origin : 'http://localhost:5000';
        const newSocket = io(socketUrl, {
        });

        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
            setIsConnected(true);

            const token = localStorage.getItem('token');
            if (token) {
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
