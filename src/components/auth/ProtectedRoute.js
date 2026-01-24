import React, { useEffect, useState } from 'react';
import { backend } from '../../services/backend';

const ProtectedRoute = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real generic app, we'd use a Context Provider. 
        // For this localized task, checking auth on mount is acceptable.
        const checkUser = async () => {
            try {
                const currentUser = await backend.getUser();

                if (currentUser) {
                    setUser(currentUser);
                } else {
                    // Determine redirect
                    // If local mode, we might auto-login or redirect to a simple login form
                    // For now, redirect to /login
                    window.location.href = '/login';
                }
            } catch (e) {
                console.error("Auth check failed", e);
                window.location.href = '/login';
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    if (loading) return <div>Loading Auth...</div>;
    if (!user) return null; // Will redirect

    return children;
};

export default ProtectedRoute;
