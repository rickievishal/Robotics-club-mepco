"use client"
import { useState, useEffect } from 'react'
import { useAuth } from '@/app/hooks/useAuth'
import ShinyText from '@/app/components/Animated-comps/ShinyText'
import RoleProtectedRoute from '@/app/components/RoleProtectedRoute'
import { FaEdit, FaTrash, FaSearch, FaUserShield, FaUser, FaUsers } from 'react-icons/fa'
import { IoIosMore } from 'react-icons/io'

const AdminUsersPage = () => {
    const { user } = useAuth()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchUsers()
        }
    }, [user])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            setError(null)
            
            const token = localStorage.getItem('token')
            
            if (!token) {
                setError('Authentication token not found. Please log in again.')
                return
            }
            
            const response = await fetch('http://localhost:8080/auth/users', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            
            if (response.ok) {
                const data = await response.json()
                setUsers(data.users || [])
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
                setError(errorData.message || `Failed to fetch users (${response.status})`)
            }
        } catch (error) {
            setError(`Network error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const updateUserRole = async (userId, newRole) => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:8080/auth/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role: newRole })
            })
            
            if (response.ok) {
                await fetchUsers()
            }
        } catch (error) {
        }
    }

    const deleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) return
        
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:8080/auth/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            
            if (response.ok) {
                await fetchUsers()
            }
        } catch (error) {
        }
    }

    const filteredUsers = users.filter(userItem => {
        const matchesSearch = userItem.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            userItem.email?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = roleFilter === 'all' || userItem.role === roleFilter
        const matchesStatus = statusFilter === 'all' || 
                             (statusFilter === 'online' && userItem.isOnline) ||
                             (statusFilter === 'offline' && !userItem.isOnline)
        
        return matchesSearch && matchesRole && matchesStatus
    })

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin':
                return <FaUserShield className="text-red-400" />
            case 'officebearer':
                return <FaUsers className="text-yellow-400" />
            default:
                return <FaUser className="text-blue-400" />
        }
    }

    const formatDate = (date) => {
        if (!date) return 'N/A'
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <RoleProtectedRoute allowedRoles={['admin']}>
                <div className="w-full pt-[50px] flex justify-center items-center min-h-screen">
                    <div className="text-[var(--primary)] text-xl">Loading users...</div>
                </div>
            </RoleProtectedRoute>
        )
    }

    if (error) {
        return (
            <RoleProtectedRoute allowedRoles={['admin']}>
                <div className="w-full pt-[50px] tracking-tighter relative min-h-screen bg-[rgb(10,10,10)]">
                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <div className="flex flex-col justify-center items-center min-h-[60vh]">
                            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-8 max-w-md">
                                <h2 className="text-xl font-bold text-red-400 mb-4">Error Loading Users</h2>
                                <p className="text-red-300 mb-6">{error}</p>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={fetchUsers}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                                    >
                                        Try Again
                                    </button>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                                    >
                                        Reload Page
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </RoleProtectedRoute>
        )
    }

    return (
        <RoleProtectedRoute allowedRoles={['admin']}>
            <div className="w-full pt-[50px] tracking-tighter relative min-h-screen bg-[rgb(10,10,10)]">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                        <div>
                            <ShinyText text="User Management" />
                            <p className="text-[rgb(155,155,155)] mt-2">
                                Manage all registered users and their roles
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0 text-sm text-[rgb(155,155,155)]">
                            Total Users: {users.length}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-[rgb(13,13,13)] border border-[rgb(29,29,29)] rounded-lg p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[rgb(155,155,155)]" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-[rgb(19,19,19)] border border-[rgb(29,29,29)] rounded-lg text-white placeholder-[rgb(155,155,155)] focus:outline-none focus:border-[var(--primary)]"
                                />
                            </div>

                            {/* Role Filter */}
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="w-full px-4 py-2 bg-[rgb(19,19,19)] border border-[rgb(29,29,29)] rounded-lg text-white focus:outline-none focus:border-[var(--primary)]"
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="officebearer">Office Bearer</option>
                                <option value="member">Member</option>
                            </select>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-2 bg-[rgb(19,19,19)] border border-[rgb(29,29,29)] rounded-lg text-white focus:outline-none focus:border-[var(--primary)]"
                            >
                                <option value="all">All Status</option>
                                <option value="online">Online</option>
                                <option value="offline">Offline</option>
                            </select>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-[rgb(13,13,13)] border border-[rgb(29,29,29)] rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[rgb(19,19,19)]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[rgb(155,155,155)] uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[rgb(155,155,155)] uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[rgb(155,155,155)] uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[rgb(155,155,155)] uppercase tracking-wider">
                                            Last Seen
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[rgb(155,155,155)] uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[rgb(29,29,29)]">
                                    {filteredUsers.map((userItem) => (
                                        <tr key={userItem._id} className="hover:bg-[rgb(19,19,19)] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-[rgb(19,19,19)] border border-[rgb(29,29,29)] flex items-center justify-center">
                                                            {userItem.image ? (
                                                                <img className="h-10 w-10 rounded-full object-cover" src={userItem.image} alt="" />
                                                            ) : (
                                                                <FaUser className="h-5 w-5 text-[rgb(155,155,155)]" />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-white">
                                                            {userItem.name}
                                                        </div>
                                                        <div className="text-sm text-[rgb(155,155,155)]">
                                                            {userItem.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    {getRoleIcon(userItem.role)}
                                                    <select
                                                        value={userItem.role}
                                                        onChange={(e) => updateUserRole(userItem._id, e.target.value)}
                                                        disabled={userItem._id === user._id}
                                                        className="text-sm bg-[rgb(19,19,19)] border border-[rgb(29,29,29)] rounded px-2 py-1 text-white focus:outline-none focus:border-[var(--primary)] disabled:opacity-50"
                                                    >
                                                        <option value="member">Member</option>
                                                        <option value="officebearer">Office Bearer</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    userItem.isOnline
                                                        ? 'bg-green-900 text-green-300'
                                                        : 'bg-gray-900 text-gray-300'
                                                }`}>
                                                    {userItem.isOnline ? 'Online' : 'Offline'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[rgb(155,155,155)]">
                                                {formatDate(userItem.lastSeen)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => deleteUser(userItem._id)}
                                                        disabled={userItem._id === user._id}
                                                        className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Delete User"
                                                    >
                                                        <FaTrash className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {filteredUsers.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-[rgb(155,155,155)]">No users found matching your criteria.</div>
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-[rgb(13,13,13)] border border-[rgb(29,29,29)] rounded-lg p-4">
                            <div className="flex items-center">
                                <FaUserShield className="h-8 w-8 text-red-400" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-[rgb(155,155,155)]">Admins</p>
                                    <p className="text-2xl font-bold text-white">
                                        {users.filter(u => u.role === 'admin').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-[rgb(13,13,13)] border border-[rgb(29,29,29)] rounded-lg p-4">
                            <div className="flex items-center">
                                <FaUsers className="h-8 w-8 text-yellow-400" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-[rgb(155,155,155)]">Office Bearers</p>
                                    <p className="text-2xl font-bold text-white">
                                        {users.filter(u => u.role === 'officebearer').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-[rgb(13,13,13)] border border-[rgb(29,29,29)] rounded-lg p-4">
                            <div className="flex items-center">
                                <FaUser className="h-8 w-8 text-blue-400" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-[rgb(155,155,155)]">Members</p>
                                    <p className="text-2xl font-bold text-white">
                                        {users.filter(u => u.role === 'member').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-[rgb(13,13,13)] border border-[rgb(29,29,29)] rounded-lg p-4">
                            <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-green-400 flex items-center justify-center">
                                    <div className="h-3 w-3 rounded-full bg-green-600"></div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-[rgb(155,155,155)]">Online</p>
                                    <p className="text-2xl font-bold text-white">
                                        {users.filter(u => u.isOnline).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </RoleProtectedRoute>
    )
}

export default AdminUsersPage

