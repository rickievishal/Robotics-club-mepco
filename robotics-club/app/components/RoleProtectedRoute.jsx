"use client"

import { useAuth } from '@/app/hooks/useAuth'
import React from 'react'
import { useRouter } from 'next/navigation'

const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth()
    const router = useRouter()

    React.useEffect(() => {
        // If still loading auth state, don't redirect yet
        if (loading) return

        // If no user, redirect to login
        if (!user) {
            router.push('/register')
            return
        }

        // If user role is not in allowed roles, redirect to appropriate page
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
            // Redirect based on user role
            switch (user.role) {
                case 'member':
                    router.push('/club/events')
                    break
                case 'officebearer':
                    // Office bearers can access event management, redirect to events management
                    if (allowedRoles.includes('officebearer')) {
                        router.push('/club/admin/events')
                    } else {
                        router.push('/club/welcome')
                    }
                    break
                case 'admin':
                    router.push('/club/welcome')
                    break
                default:
                    router.push('/register')
                    break
            }
        }
    }, [user, loading, allowedRoles, router])

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="w-full flex justify-center items-center min-h-screen">
                <div className="text-2xl text-gray-400">Loading...</div>
            </div>
        )
    }

    // If no user, don't render children (will redirect)
    if (!user) {
        return null
    }

    // If user role is not allowed, don't render children (will redirect)
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return null
    }

    return children
}

export default RoleProtectedRoute

