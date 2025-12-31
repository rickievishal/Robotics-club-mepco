'use client';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, allowedPaths = [] }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Only redirect if not loading and not authenticated
        if (!loading && !user) {
            router.push('/register');
        }
    }, [user, loading, router]);

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="w-screen h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

    // Don't render children if not authenticated
    if (!user) {
        return null;
    }

    // Render children if authenticated
    return children;
};

export default ProtectedRoute;
