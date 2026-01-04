"use client"
import { useState, useEffect } from 'react'
import { useAuth } from '@/app/hooks/useAuth'
import ShinyText from '@/app/components/Animated-comps/ShinyText'
import RoleProtectedRoute from '@/app/components/RoleProtectedRoute'
import { Link } from 'next/link'
import { FaUsers, FaCalendarAlt, FaChartBar, FaCog, FaUserShield, FaBell, FaDatabase, FaNetworkWired, FaUser } from 'react-icons/fa'
import { API_BASE_URL } from '@/app/utils/apiConfig'

const AdminDashboard = () => {
    const { user } = useAuth()
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalEvents: 0,
        onlineUsers: 0,
        upcomingEvents: 0
    })
    const [recentUsers, setRecentUsers] = useState([])
    const [recentEvents, setRecentEvents] = useState([])

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token')
            
            // Fetch users data
            const usersResponse = await fetch(`${API_BASE_URL}/auth/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            
            if (usersResponse.ok) {
                const usersData = await usersResponse.json()
                const users = usersData.users || []
                
                setStats(prev => ({
                    ...prev,
                    totalUsers: users.length,
                    onlineUsers: users.filter(u => u.isOnline).length
                }))
                
                setRecentUsers(users.slice(-5).reverse())
            }

            // Fetch events data
            const eventsResponse = await fetch(`${API_BASE_URL}/events`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            
            if (eventsResponse.ok) {
                const eventsData = await eventsResponse.json()
                const events = eventsData.events || []
                
                setStats(prev => ({
                    ...prev,
                    totalEvents: events.length,
                    upcomingEvents: events.filter(e => new Date(e.date) > new Date()).length
                }))
                
                setRecentEvents(events.slice(-3).reverse())
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const adminMenuItems = [
        {
            title: 'User Management',
            description: 'Manage all registered users and roles',
            icon: <FaUsers className="h-8 w-8" />,
            color: 'text-blue-400',
            link: '/club/admin/users',
            count: stats.totalUsers
        },
        {
            title: 'Event Management',
            description: 'Create, edit, and manage club events',
            icon: <FaCalendarAlt className="h-8 w-8" />,
            color: 'text-green-400',
            link: '/club/admin/events',
            count: stats.totalEvents
        },
        {
            title: 'Analytics',
            description: 'View detailed club analytics and reports',
            icon: <FaChartBar className="h-8 w-8" />,
            color: 'text-purple-400',
            link: '/club/admin/analytics',
            count: null
        },
        {
            title: 'System Settings',
            description: 'Configure club settings and preferences',
            icon: <FaCog className="h-8 w-8" />,
            color: 'text-gray-400',
            link: '/club/admin/settings',
            count: null
        }
    ]

    return (
        <RoleProtectedRoute allowedRoles={['admin']}>
            <div className="w-full pt-[50px] tracking-tighter relative min-h-screen bg-[rgb(10,10,10)]">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                        <div>
                            <ShinyText text="Admin Dashboard" />
                            <p className="text-[rgb(155,155,155)] mt-2">
                                Welcome back, {user?.name}. Manage your robotics club efficiently.
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                            <div className="text-sm text-[rgb(155,155,155)]">
                                Last updated: {new Date().toLocaleTimeString()}
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
                                <span className="text-sm text-green-400">System Online</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-[rgb(13,13,13)] border border-[rgb(29,29,29)] rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-blue-900">
                                    <FaUsers className="h-6 w-6 text-blue-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-[rgb(155,155,155)]">Total Users</p>
                                    <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-[rgb(13,13,13)] border border-[rgb(29,29,29)] rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-900">
                                    <FaNetworkWired className="h-6 w-6 text-green-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-[rgb(155,155,155)]">Online Now</p>
                                    <p className="text-2xl font-bold text-white">{stats.onlineUsers}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-[rgb(13,13,13)] border border-[rgb(29,29,29)] rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-purple-900">
                                    <FaCalendarAlt className="h-6 w-6 text-purple-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-[rgb(155,155,155)]">Total Events</p>
                                    <p className="text-2xl font-bold text-white">{stats.totalEvents}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-[rgb(13,13,13)] border border-[rgb(29,29,29)] rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-yellow-900">
                                    <FaBell className="h-6 w-6 text-yellow-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-[rgb(155,155,155)]">Upcoming</p>
                                    <p className="text-2xl font-bold text-white">{stats.upcomingEvents}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Admin Menu */}
                        <div className="lg:col-span-2">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-white mb-4">Admin Tools</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {adminMenuItems.map((item, index) => (
                                    <Link key={index} href={item.link}>
                                        <div className="bg-[rgb(13,13,13)] border border-[rgb(29,29,29)] rounded-lg p-6 hover:border-[var(--primary)] transition-all cursor-pointer group">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`${item.color} group-hover:scale-110 transition-transform`}>
                                                    {item.icon}
                                                </div>
                                                {item.count !== null && (
                                                    <span className="bg-[rgb(19,19,19)] text-white text-sm px-2 py-1 rounded-full">
                                                        {item.count}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                                            <p className="text-[rgb(155,155,155)] text-sm">{item.description}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="space-y-6">
                            {/* Recent Users */}
                            <div className="bg-[rgb(13,13,13)] border border-[rgb(29,29,29)] rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <FaUserShield className="h-5 w-5 mr-2 text-blue-400" />
                                    Recent Users
                                </h3>
                                <div className="space-y-3">
                                    {recentUsers.length > 0 ? (
                                        recentUsers.map((userItem) => (
                                            <div key={userItem._id} className="flex items-center space-x-3">
                                                <div className="h-8 w-8 rounded-full bg-[rgb(19,19,19)] border border-[rgb(29,29,29)] flex items-center justify-center">
                                                    <FaUser className="h-4 w-4 text-[rgb(155,155,155)]" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-white truncate">
                                                        {userItem.name}
                                                    </p>
                                                    <p className="text-xs text-[rgb(155,155,155)] truncate">
                                                        {userItem.email}
                                                    </p>
                                                </div>
                                                <div className={`h-2 w-2 rounded-full ${
                                                    userItem.isOnline ? 'bg-green-400' : 'bg-gray-400'
                                                }`}></div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-[rgb(155,155,155)] text-sm">No recent users</p>
                                    )}
                                </div>
                            </div>

                            {/* Recent Events */}
                            <div className="bg-[rgb(13,13,13)] border border-[rgb(29,29,29)] rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <FaCalendarAlt className="h-5 w-5 mr-2 text-green-400" />
                                    Recent Events
                                </h3>
                                <div className="space-y-3">
                                    {recentEvents.length > 0 ? (
                                        recentEvents.map((event) => (
                                            <div key={event._id} className="flex items-center space-x-3">
                                                <div className="h-8 w-8 rounded-full bg-[rgb(19,19,19)] border border-[rgb(29,29,29)] flex items-center justify-center">
                                                    <FaCalendarAlt className="h-4 w-4 text-[rgb(155,155,155)]" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-white truncate">
                                                        {event.title}
                                                    </p>
                                                    <p className="text-xs text-[rgb(155,155,155)]">
                                                        {formatDate(event.date)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-[rgb(155,155,155)] text-sm">No recent events</p>
                                    )}
                                </div>
                            </div>

                            {/* System Status */}
                            <div className="bg-[rgb(13,13,13)] border border-[rgb(29,29,29)] rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <FaDatabase className="h-5 w-5 mr-2 text-purple-400" />
                                    System Status
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[rgb(155,155,155)]">Database</span>
                                        <div className="flex items-center space-x-2">
                                            <div className="h-2 w-2 rounded-full bg-green-400"></div>
                                            <span className="text-xs text-green-400">Connected</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[rgb(155,155,155)]">Socket.IO</span>
                                        <div className="flex items-center space-x-2">
                                            <div className="h-2 w-2 rounded-full bg-green-400"></div>
                                            <span className="text-xs text-green-400">Active</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[rgb(155,155,155)]">Chat System</span>
                                        <div className="flex items-center space-x-2">
                                            <div className="h-2 w-2 rounded-full bg-green-400"></div>
                                            <span className="text-xs text-green-400">Online</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </RoleProtectedRoute>
    )
}

export default AdminDashboard

