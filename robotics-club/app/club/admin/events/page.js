"use client"
import { useState, useEffect } from 'react'
import { useAuth } from '@/app/hooks/useAuth'
import ShinyText from '@/app/components/Animated-comps/ShinyText'
import RoleProtectedRoute from '@/app/components/RoleProtectedRoute'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaCalendarAlt, FaUsers, FaMapMarkerAlt, FaClock, FaImage, FaUpload, FaCheck, FaTimes, FaCompressArrowsAlt } from 'react-icons/fa'
import { validateImage, compressImage, formatFileSize, MAX_IMAGE_SIZE, getBase64Size } from '@/app/utils/imageUtils'
import LoadingComp from '@/app/components/Animated-comps/LoadingComp'

const AdminEventsPage = () => {
    const { user } = useAuth()
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [showModal, setShowModal] = useState(false)
    const [editingEvent, setEditingEvent] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        maxParticipants: '',
        eventType: 'workshop',
        image: ''
    })
    const [imageError, setImageError] = useState('')
    const [imageProcessing, setImageProcessing] = useState(false)
    const [originalFileSize, setOriginalFileSize] = useState(null)
    const [compressedFileSize, setCompressedFileSize] = useState(null)

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:8080/events', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            
            if (response.ok) {
                const data = await response.json()
                setEvents(data.events || [])
            }
        } catch (error) {
            // Error fetching events
        } finally {
            setLoading(false)
        }
    }

    const createEvent = async (eventData) => {
        try {
            const token = localStorage.getItem('token')
            
            const response = await fetch('http://localhost:8080/events', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            })
            
            const responseData = await response.json()
            
            if (response.ok) {
                await fetchEvents()
                setShowModal(false)
                resetForm()
                alert('Event created successfully!')
            } else {
                alert(`Failed to create event: ${responseData.message || 'Unknown error'}`)
            }
        } catch (error) {
            alert(`Error creating event: ${error.message}`)
        }
    }

    const updateEvent = async (eventId, eventData) => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:8080/events/${eventId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            })
            
            if (response.ok) {
                await fetchEvents()
                setShowModal(false)
                setEditingEvent(null)
                resetForm()
            } else {
                // Failed to update event
            }
        } catch (error) {
            // Error updating event
        }
    }

    const deleteEvent = async (eventId) => {
        if (!confirm('Are you sure you want to delete this event?')) return
        
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:8080/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            
            if (response.ok) {
                await fetchEvents()
            } else {
                // Failed to delete event
            }
        } catch (error) {
            // Error deleting event
        }
    }

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            date: '',
            time: '',
            location: '',
            maxParticipants: '',
            eventType: 'workshop',
            image: ''
        })
        setImageError('')
        setImageProcessing(false)
        setOriginalFileSize(null)
        setCompressedFileSize(null)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const eventData = {
            ...formData,
            date: `${formData.date}T${formData.time}`,
            venue: formData.location,
            maxParticipants: parseInt(formData.maxParticipants) || null,
            image: formData.image || 'https://i.pinimg.com/736x/c3/a9/27/c3a927ca97d4f83d7918e4a4cd2deb0d.jpg'
        }
        
        if (editingEvent) {
            updateEvent(editingEvent._id, eventData)
        } else {
            createEvent(eventData)
        }
    }

    const openEditModal = (event) => {
        setEditingEvent(event)
        setFormData({
            title: event.title || '',
            description: event.description || '',
            date: event.date ? event.date.split('T')[0] : '',
            time: event.date ? event.date.split('T')[1]?.substring(0, 5) || '' : '',
            location: event.venue || '',
            maxParticipants: event.maxParticipants?.toString() || '',
            eventType: event.eventType || 'workshop',
            image: event.image || ''
        })
        setImageError('')
        setOriginalFileSize(null)
        setCompressedFileSize(null)
        setShowModal(true)
    }

    const openCreateModal = () => {
        setEditingEvent(null)
        resetForm()
        setShowModal(true)
    }

    const handleImageFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setImageError('')
        setOriginalFileSize(null)
        setCompressedFileSize(null)

        const validation = validateImage(file)
        if (!validation.isValid) {
            setImageError(validation.message)
            return
        }

        setOriginalFileSize(file.size)
        setImageProcessing(true)

        try {
            const compressedImage = await compressImage(file)
            setCompressedFileSize(getBase64Size(compressedImage))
            setFormData({ ...formData, image: compressedImage })
        } catch (error) {
            setImageError(error.message)
        } finally {
            setImageProcessing(false)
        }
    }

    const handleImageUrlChange = (e) => {
        setFormData({ ...formData, image: e.target.value })
        setImageError('')
        setOriginalFileSize(null)
        setCompressedFileSize(null)
    }

    const clearImage = () => {
        setFormData({ ...formData, image: '' })
        setImageError('')
        setOriginalFileSize(null)
        setCompressedFileSize(null)
    }

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.description?.toLowerCase().includes(searchTerm.toLowerCase())
        const eventDate = new Date(event.date)
        const now = new Date()
        const matchesStatus = statusFilter === 'all' ||
                             (statusFilter === 'upcoming' && eventDate > now) ||
                             (statusFilter === 'past' && eventDate <= now)
        
        return matchesSearch && matchesStatus
    })

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <RoleProtectedRoute allowedRoles={['admin', 'officebearer']}>
                <div className="w-full pt-[50px] flex justify-center items-center min-h-screen">
                    <LoadingComp/>
                    {/* <div className="text-[var(--primary)] text-xl">Loading events...</div> */}
                </div>
            </RoleProtectedRoute>
        )
    }

    return (
        <RoleProtectedRoute allowedRoles={['admin', 'officebearer']}>
            <div className="w-full pt-[50px] tracking-tighter relative min-h-screen bg-[rgb(10,10,10)]">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                        <div>
                            <ShinyText text="Event Management" />
                            <p className="text-[rgb(155,155,155)] mt-2">
                                Create, edit, and manage all club events
                            </p>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="mt-4 sm:mt-0 bg-[var(--primary)] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[var(--primary)]/80 transition-all flex items-center space-x-2"
                        >
                            <FaPlus className="h-4 w-4" />
                            <span>Create Event</span>
                        </button>
                    </div>

                    <div className="bg-[rgb(13,13,13)] border border-[rgb(29,29,29)] rounded-lg p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[rgb(155,155,155)]" />
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-[rgb(19,19,19)] border border-[rgb(29,29,29)] rounded-lg text-white placeholder-[rgb(155,155,155)] focus:outline-none focus:border-[var(--primary)]"
                                />
                            </div>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-2 bg-[rgb(19,19,19)] border border-[rgb(29,29,29)] rounded-lg text-white focus:outline-none focus:border-[var(--primary)]"
                            >
                                <option value="all">All Events</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="past">Past</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-[rgb(13,13,13)] border border-[rgb(29,29,29)] rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[rgb(19,19,19)]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[rgb(155,155,155)] uppercase tracking-wider">
                                            Cover
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[rgb(155,155,155)] uppercase tracking-wider">
                                            Event
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[rgb(155,155,155)] uppercase tracking-wider">
                                            Date & Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[rgb(155,155,155)] uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[rgb(155,155,155)] uppercase tracking-wider">
                                            Participants
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[rgb(155,155,155)] uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[rgb(155,155,155)] uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[rgb(29,29,29)]">
                                    {filteredEvents.map((event) => (
                                        <tr key={event._id} className="hover:bg-[rgb(19,19,19)] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex-shrink-0">
                                                    <img 
                                                        src={event.image || 'https://i.pinimg.com/736x/c3/a9/27/c3a927ca97d4f83d7918e4a4cd2deb0d.jpg'} 
                                                        alt={event.title}
                                                        className="h-16 w-24 object-cover rounded border border-[rgb(29,29,29)]"
                                                        onError={(e) => {
                                                            e.target.src = 'https://i.pinimg.com/736x/c3/a9/27/c3a927ca97d4f83d7918e4a4cd2deb0d.jpg'
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-[rgb(19,19,19)] border border-[rgb(29,29,29)] flex items-center justify-center">
                                                            <FaCalendarAlt className="h-5 w-5 text-[var(--primary)]" />
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-white">
                                                            {event.title}
                                                        </div>
                                                        <div className="text-sm text-[rgb(155,155,155)] max-w-xs truncate">
                                                            {event.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-white">
                                                    <FaClock className="h-4 w-4 mr-2 text-[var(--primary)]" />
                                                    {formatDate(event.date)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-white">
                                                    <FaMapMarkerAlt className="h-4 w-4 mr-2 text-[var(--primary)]" />
                                                    {event.venue || 'TBD'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-white">
                                                    <FaUsers className="h-4 w-4 mr-2 text-[var(--primary)]" />
                                                    {event.maxParticipants || 'Unlimited'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    new Date(event.date) > new Date()
                                                        ? 'bg-green-900 text-green-300'
                                                        : 'bg-gray-900 text-gray-300'
                                                }`}>
                                                    {new Date(event.date) > new Date() ? 'Upcoming' : 'Past'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => openEditModal(event)}
                                                        className="text-blue-400 hover:text-blue-300"
                                                        title="Edit Event"
                                                    >
                                                        <FaEdit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteEvent(event._id)}
                                                        className="text-red-400 hover:text-red-300"
                                                        title="Delete Event"
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
                        
                        {filteredEvents.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-[rgb(155,155,155)]">No events found matching your criteria.</div>
                            </div>
                        )}
                    </div>
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-[rgb(13,13,13)] border border-[rgb(29,29,29)] rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                            <h3 className="text-lg font-bold text-white mb-4">
                                {editingEvent ? 'Edit Event' : 'Create New Event'}
                            </h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[rgb(155,155,155)] mb-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="w-full px-3 py-2 bg-[rgb(19,19,19)] border border-[rgb(29,29,29)] rounded text-white focus:outline-none focus:border-[var(--primary)]"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-[rgb(155,155,155)] mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className="w-full px-3 py-2 bg-[rgb(19,19,19)] border border-[rgb(29,29,29)] rounded text-white focus:outline-none focus:border-[var(--primary)]"
                                        rows="3"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[rgb(155,155,155)] mb-1">
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.date}
                                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                                            className="w-full px-3 py-2 bg-[rgb(19,19,19)] border border-[rgb(29,29,29)] rounded text-white focus:outline-none focus:border-[var(--primary)]"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-[rgb(155,155,155)] mb-1">
                                            Time
                                        </label>
                                        <input
                                            type="time"
                                            required
                                            value={formData.time}
                                            onChange={(e) => setFormData({...formData, time: e.target.value})}
                                            className="w-full px-3 py-2 bg-[rgb(19,19,19)] border border-[rgb(29,29,29)] rounded text-white focus:outline-none focus:border-[var(--primary)]"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-[rgb(155,155,155)] mb-1">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        className="w-full px-3 py-2 bg-[rgb(19,19,19)] border border-[rgb(29,29,29)] rounded text-white focus:outline-none focus:border-[var(--primary)]"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[rgb(155,155,155)] mb-1">
                                            Max Participants
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.maxParticipants}
                                            onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                                            className="w-full px-3 py-2 bg-[rgb(19,19,19)] border border-[rgb(29,29,29)] rounded text-white focus:outline-none focus:border-[var(--primary)]"
                                            placeholder="Leave empty for unlimited"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-[rgb(155,155,155)] mb-1">
                                            Event Type
                                        </label>
                                        <select
                                            value={formData.eventType}
                                            onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                                            className="w-full px-3 py-2 bg-[rgb(19,19,19)] border border-[rgb(29,29,29)] rounded text-white focus:outline-none focus:border-[var(--primary)]"
                                        >
                                            <option value="workshop">Workshop</option>
                                            <option value="meeting">Meeting</option>
                                            <option value="competition">Competition</option>
                                            <option value="seminar">Seminar</option>
                                            <option value="social">Social</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-[rgb(155,155,155)] mb-2">
                                        Event Cover Image
                                        <span className="text-xs ml-2 text-[rgb(100,100,100)]">
                                            (Max: {formatFileSize(MAX_IMAGE_SIZE)})
                                        </span>
                                    </label>
                                    
                                    {formData.image && (
                                        <div className="mb-4 relative">
                                            <img 
                                                src={formData.image} 
                                                alt="Event cover preview" 
                                                className="w-full h-32 object-cover rounded-lg border border-[rgb(29,29,29)]"
                                                onError={(e) => {
                                                    e.target.src = 'https://i.pinimg.com/736x/c3/a9/27/c3a927ca97d4f83d7918e4a4cd2deb0d.jpg'
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={clearImage}
                                                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                                                title="Remove image"
                                            >
                                                <FaTimes className="h-3 w-3" />
                                            </button>
                                            
                                            {compressedFileSize && (
                                                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs text-white flex items-center">
                                                    <FaCompressArrowsAlt className="h-3 w-3 mr-1 text-green-400" />
                                                    {formatFileSize(compressedFileSize)}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {imageError && (
                                        <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg flex items-center text-red-400 text-sm">
                                            <FaTimes className="h-4 w-4 mr-2 flex-shrink-0" />
                                            {imageError}
                                        </div>
                                    )}
                                    
                                    <div className="flex space-x-4">
                                        <div className="flex-1">
                                            <input
                                                type="url"
                                                value={formData.image}
                                                onChange={handleImageUrlChange}
                                                className="w-full px-3 py-2 bg-[rgb(19,19,19)] border border-[rgb(29,29,29)] rounded text-white focus:outline-none focus:border-[var(--primary)]"
                                                placeholder="Or enter image URL"
                                            />
                                        </div>
                                        
                                        <label className="bg-[rgb(19,19,19)] border border-[rgb(29,29,29)] rounded px-4 py-2 cursor-pointer hover:border-[var(--primary)] transition-colors flex items-center space-x-2">
                                            {imageProcessing ? (
                                                <FaCompressArrowsAlt className="h-4 w-4 text-[var(--primary)] animate-spin" />
                                            ) : (
                                                <FaUpload className="h-4 w-4 text-[rgb(155,155,155)]" />
                                            )}
                                            <span className="text-[rgb(155,155,155)] text-sm">
                                                {imageProcessing ? 'Compressing...' : 'Upload'}
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                                className="hidden"
                                                onChange={handleImageFileChange}
                                            />
                                        </label>
                                    </div>
                                    
                                    <div className="mt-2 text-xs text-[rgb(100,100,100)]">
                                        {originalFileSize && (
                                            <span className="flex items-center">
                                                Original: {formatFileSize(originalFileSize)}
                                                {compressedFileSize && (
                                                    <span className="mx-2">→</span>
                                                )}
                                                {compressedFileSize && (
                                                    <span className="text-green-400 flex items-center">
                                                        <FaCheck className="h-3 w-3 mr-1" />
                                                        Compressed: {formatFileSize(compressedFileSize)}
                                                    </span>
                                                )}
                                            </span>
                                        )}
                                        {!originalFileSize && (
                                            <span>Supported formats: JPG, PNG, GIF, WEBP. Images will be automatically compressed.</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex justify-end space-x-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 text-[rgb(155,155,155)] hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-[var(--primary)] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[var(--primary)]/80 transition-all"
                                    >
                                        {editingEvent ? 'Update Event' : 'Create Event'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </RoleProtectedRoute>
    )
}

export default AdminEventsPage

