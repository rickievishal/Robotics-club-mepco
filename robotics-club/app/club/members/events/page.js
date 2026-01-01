'use client';
import ShinyText from '@/app/components/Animated-comps/ShinyText'
import RoleProtectedRoute from '@/app/components/RoleProtectedRoute'
import { useAuth } from '@/app/hooks/useAuth'
import { getAllEvents } from '@/app/components/api'
import React, { useState, useEffect } from 'react'
import { IoMdClose } from "react-icons/io";
import { FaSearch, FaFilter, FaCalendarAlt, FaClock, FaUser } from 'react-icons/fa'

const page = () => {
    const { user, token } = useAuth();
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortFilter, setSortFilter] = useState('all'); // all, upcoming, today, past
    
    useEffect(() => {
        fetchEvents();
    }, []);
    
    useEffect(() => {
        filterAndSortEvents();
    }, [events, searchTerm, sortFilter]);
    
    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await getAllEvents();
            if (response.data.success) {
                setEvents(response.data.events);
            } else {
                setError('Failed to fetch events');
            }
        } catch (err) {
            setError('Error loading events. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const filterAndSortEvents = () => {
        let filtered = [...events];
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(event =>
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.venue.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Apply sort filter
        if (sortFilter !== 'all') {
            if (sortFilter === 'upcoming') {
                filtered = filtered.filter(event => new Date(event.date) > now);
            } else if (sortFilter === 'today') {
                filtered = filtered.filter(event => {
                    const eventDate = new Date(event.date);
                    return eventDate.toDateString() === today.toDateString();
                });
            } else if (sortFilter === 'past') {
                filtered = filtered.filter(event => new Date(event.date) < today);
            }
        }
        
        // Sort by date
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        setFilteredEvents(filtered);
    };
    
    const groupEventsByDate = (eventsList) => {
        const grouped = {};
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        eventsList.forEach(event => {
            const eventDate = new Date(event.date);
            let groupKey;
            
            if (eventDate.toDateString() === today.toDateString()) {
                groupKey = 'today';
            } else if (eventDate > now) {
                groupKey = 'upcoming';
            } else {
                groupKey = 'past';
            }
            
            if (!grouped[groupKey]) {
                grouped[groupKey] = [];
            }
            grouped[groupKey].push(event);
        });
        
        return grouped;
    };
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const eventDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        
        if (eventDate.toDateString() === today.toDateString()) {
            return 'Today';
        }
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (eventDate.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        }
        
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };
    
    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    const handleEventView = (event) => {
        setSelectedEvent(event);
    };
    
    const handleEventClose = () => {
        setSelectedEvent(null);
    };
    
    if (loading) {
        return (
            <RoleProtectedRoute allowedRoles={['member', 'officebearer', 'admin']}>
                <div className='w-full pt-[50px] tracking-tighter relative flex justify-center items-center min-h-screen'>
                    <div className='text-2xl text-[var(--primary)]'>Loading events...</div>
                </div>
            </RoleProtectedRoute>
        );
    }
    
    if (error) {
        return (
            <RoleProtectedRoute allowedRoles={['member', 'officebearer', 'admin']}>
                <div className='w-full pt-[50px] tracking-tighter relative flex justify-center items-center min-h-screen'>
                    <div className='text-xl text-red-500'>{error}</div>
                </div>
            </RoleProtectedRoute>
        );
    }
    
    const groupedEvents = groupEventsByDate(filteredEvents);
    
    return (
        <RoleProtectedRoute allowedRoles={['member', 'officebearer', 'admin']}>
            <div className='w-full pt-[50px] tracking-tighter relative'>
                {/* Event Detail Modal */}
                {selectedEvent && (
                    <>
                        <div className='w-screen h-screen flex justify-center items-center fixed top-0 left-0 bg-black/30 z-30'>
                            <div className='w-full h-full sm:max-w-2xl lg:max-w-4xl sm:max-h-[700px] bg-black px-4 sm:px-8 z-40 py-[50px] flex justify-start items-center sm:items-start relative rounded-lg border border-white/10'>
                                <div className='w-[35px] h-[35px] bg-[var(--primary)] border border-white/20 absolute top-16 right-2 sm:top-4 sm:right-4 rounded-full flex justify-center items-center hover:cursor-pointer' onClick={handleEventClose}>
                                    <IoMdClose className='text-black text-xl' />
                                </div>
                                <div className='w-full h-full grid grid-cols-3 pt-8 lg:pt-0'>
                                    <div className='col-span-3 sm:col-span-1 rounded-lg overflow-hidden border-[1px] border-white/15'>
                                        <img className='w-full h-full object-cover' src={selectedEvent.image} alt={selectedEvent.title} />
                                    </div>
                                    <div className='flex col-span-3 sm:col-span-2 flex-col text-[rgb(155,155,155)] sm:pl-8 mt-4'>
                                        <ShinyText text={"Event Details"} />
                                        <h2 className='text-2xl font-bold text-[var(--primary)]'>{selectedEvent.title}</h2>
                                        <h3 className='text-lg font-bold mt-2'>Description</h3>
                                        <p className=''>{selectedEvent.description}</p>
                                        {selectedEvent.host && selectedEvent.host.length > 0 && (
                                            <>
                                                <h3 className='text-lg font-bold mt-2'>Hosted By</h3>
                                                <ol>
                                                    {selectedEvent.host.map((host, index) => (
                                                        <li key={index}><p>{host}</p></li>
                                                    ))}
                                                </ol>
                                            </>
                                        )}
                                        <h3 className='text-lg font-bold mt-2'>Venue</h3>
                                        <p className=''>{selectedEvent.venue}</p>
                                        <h3 className='text-lg font-bold mt-2'>Date & Time</h3>
                                        <p className=''>{formatDate(selectedEvent.date)} at {formatTime(selectedEvent.date)}</p>
                                        {selectedEvent.maxParticipants && (
                                            <>
                                                <h3 className='text-lg font-bold mt-2'>Max Participants</h3>
                                                <p className=''>{selectedEvent.maxParticipants}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Welcome Header for Members */}
                <div className='max-w-2xl lg:max-w-5xl mx-auto px-2 py-16 flex flex-col justify-center items-center z-20'>
                    <div className='text-center mb-8'>
                        <ShinyText className='text-3xl mb-4' text={"Member Events"} />
                        <div className='flex items-center justify-center gap-2 text-gray-400 mb-6'>
                            <FaUser className='text-[var(--primary)]' />
                            <span>Welcome, {user?.name || 'Member'}!</span>
                        </div>
                        <p className='text-gray-400 max-w-md mx-auto'>
                            Discover and join upcoming robotics events, workshops, and activities. 
                            Click on any event to view detailed information.
                        </p>
                    </div>

                    {/* Search and Filter Controls */}
                    <div className='w-full mb-8 p-4 bg-black/20 rounded-lg border border-white/10'>
                        <div className='flex flex-col sm:flex-row gap-4 items-center'>
                            {/* Search Input */}
                            <div className='relative flex-1'>
                                <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                                <input
                                    type="text"
                                    placeholder="Search events by title, description, or venue..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[var(--primary)]"
                                />
                            </div>
                            
                            {/* Sort Filter */}
                            <div className='flex items-center gap-2'>
                                <FaFilter className='text-gray-400' />
                                <select
                                    value={sortFilter}
                                    onChange={(e) => setSortFilter(e.target.value)}
                                    className="px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[var(--primary)]"
                                >
                                    <option value="all">All Events</option>
                                    <option value="today">Today's Events</option>
                                    <option value="upcoming">Upcoming Events</option>
                                    <option value="past">Past Events</option>
                                </select>
                            </div>
                        </div>
                        
                        {/* Results Count */}
                        <div className='mt-3 text-sm text-gray-400'>
                            Showing {filteredEvents.length} of {events.length} events
                        </div>
                    </div>
                    
                    {/* Event Groups */}
                    {Object.keys(groupedEvents).length === 0 ? (
                        <div className='text-center py-16'>
                            <div className='text-2xl text-gray-400 mb-4'>
                                {searchTerm || sortFilter !== 'all' ? 'No events found' : 'No events available'}
                            </div>
                            <p className='text-gray-500'>
                                {searchTerm || sortFilter !== 'all' 
                                    ? 'Try adjusting your search or filter criteria'
                                    : 'Events will appear here once they are created'
                                }
                            </p>
                        </div>
                    ) : (
                        Object.entries(groupedEvents).map(([groupKey, groupEvents]) => (
                            <div key={groupKey} className='w-full mb-12'>
                                {/* Group Header */}
                                <div className='w-full flex flex-col-reverse sm:flex-row justify-between sm:items-center mb-6'>
                                    <h1 className='text-2xl font-bold text-[rgb(155,155,155)]'>
                                        {groupKey === 'today' && '👀 Today\'s Events'}
                                        {groupKey === 'upcoming' && '🚀 Upcoming Events'}
                                        {groupKey === 'past' && '📚 Past Events'}
                                    </h1>
                                    <ShinyText className='text-lg' text={
                                        groupKey === 'today' ? "Today's Events" :
                                        groupKey === 'upcoming' ? "Upcoming Events" :
                                        "Past Events"
                                    }/>
                                </div>
                                
                                {/* Events Grid */}
                                <div className='w-full flex flex-wrap items-center justify-center z-20'>
                                    {groupEvents.map((event) => (
                                        <div 
                                            key={event._id}
                                            className='sm:max-w-[300px] w-full sm:max-h-[400px] flex flex-col items-start justify-items-start bg-[rgb(13,13,13)] border-[rgb(29,29,29)] border-[1px] rounded-lg m-2 p-2 hover:cursor-pointer hover:border-[var(--primary)]/50 transition-all duration-300'
                                            onClick={() => handleEventView(event)}
                                        >
                                            <div className='w-full h-[400px] sm:h-[300px] bg-[rgb(19,19,19)] rounded-sm border-[1px] border-[rgb(29,29,29)] overflow-hidden'>
                                                <img 
                                                    className='w-full h-full object-cover hover:scale-105 transition-transform duration-300' 
                                                    src={event.image} 
                                                    alt={event.title}
                                                    onError={(e) => {
                                                        e.target.src = 'https://i.pinimg.com/736x/c3/a9/27/c3a927ca97d4f83d7918e4a4cd2deb0d.jpg';
                                                    }}
                                                />
                                            </div>
                                            <div className='w-full flex flex-col p-1'>
                                                <p className='mt-2 text-xl font-bold text-[rgb(163,163,163)] leading-tight'>
                                                    {event.title}
                                                </p>
                                                <div className='w-full flex justify-between items-center mt-2'>
                                                    <p className='text-sm font-bold text-[rgb(163,163,163)] leading-tight'>
                                                        Venue: <span className='font-normal'>{event.venue}</span>
                                                    </p>
                                                    <p className='text-[var(--primary)]/60 px-2 border border-[rgb(163,163,163)]/20 bg-black rounded-lg text-xs'>
                                                        {formatDate(event.date)}
                                                    </p>
                                                </div>
                                                <div className='flex items-center gap-2 mt-1 text-xs text-gray-400'>
                                                    <FaClock />
                                                    <span>{formatTime(event.date)}</span>
                                                </div>
                                                {event.description && (
                                                    <p className='text-xs text-gray-400 mt-2 line-clamp-2'>
                                                        {event.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </RoleProtectedRoute>
    );
}

export default page
