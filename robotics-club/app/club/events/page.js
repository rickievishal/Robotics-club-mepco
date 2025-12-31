"use client"
import ShinyText from '@/app/components/Animated-comps/ShinyText'
import { useAuth } from '@/app/hooks/useAuth'
import { getAllEvents } from '@/app/components/api'
import React, { useState, useEffect } from 'react'
import { IoMdClose } from "react-icons/io";
import { FaSearch, FaFilter, FaCalendarAlt, FaClock, FaChevronDown, FaChevronUp } from 'react-icons/fa'

const page = () => {
    const { user, token } = useAuth();
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortFilter, setSortFilter] = useState('all'); // all, thisWeek, upcoming, past
    const [showPastEvents, setShowPastEvents] = useState(false);
    
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
            console.error('Error fetching events:', err);
            setError('Error loading events. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const filterAndSortEvents = () => {
        let filtered = [...events];
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisWeekEnd = new Date(today);
        thisWeekEnd.setDate(thisWeekEnd.getDate() + 7);
        
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
            if (sortFilter === 'thisWeek') {
                filtered = filtered.filter(event => {
                    const eventDate = new Date(event.date);
                    return eventDate >= today && eventDate <= thisWeekEnd;
                });
            } else if (sortFilter === 'upcoming') {
                filtered = filtered.filter(event => new Date(event.date) > thisWeekEnd);
            } else if (sortFilter === 'past') {
                filtered = filtered.filter(event => new Date(event.date) < today);
            }
        }
        
        // Sort by date
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        setFilteredEvents(filtered);
    };
    
    const getThisWeekEvents = () => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisWeekEnd = new Date(today);
        thisWeekEnd.setDate(thisWeekEnd.getDate() + 7);
        
        return events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= today && eventDate <= thisWeekEnd;
        }).sort((a, b) => new Date(a.date) - new Date(b.date));
    };
    
    const getUpcomingEvents = () => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisWeekEnd = new Date(today);
        thisWeekEnd.setDate(thisWeekEnd.getDate() + 7);
        
        return events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate > thisWeekEnd;
        }).sort((a, b) => new Date(a.date) - new Date(b.date));
    };
    
    const getPastEvents = () => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        return events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate < today;
        }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort past events in reverse chronological order
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
            day: 'numeric'
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
            <div className='w-full pt-[50px] tracking-tighter relative flex justify-center items-center min-h-screen'>
                <div className='text-2xl text-[var(--primary)]'>Loading events...</div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className='w-full pt-[50px] tracking-tighter relative flex justify-center items-center min-h-screen'>
                <div className='text-xl text-red-500'>{error}</div>
            </div>
        );
    }
    
    const thisWeekEvents = getThisWeekEvents();
    const upcomingEvents = getUpcomingEvents();
    const pastEvents = getPastEvents();
    
    return (
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
            
            {/* Search and Filter Controls */}
            <div className='w-[10px] h-[350px] bg-[var(--primary)] absolute top-0 left-[50%] -translate-y-4 rotate-45 blur-[60px] z-10'></div>
            <div className='max-w-2xl lg:max-w-5xl mx-auto px-2 py-16 flex flex-col justify-center items-center z-20'>
                {/* Login prompt for non-authenticated users */}
                {!user && (
                    <div className='w-full mb-8 p-4 bg-[var(--primary)]/10 rounded-lg border border-[var(--primary)]/20 text-center'>
                        <p className='text-[var(--primary)] font-medium'>
                            👋 Welcome! Please <a href="/register" className='underline hover:text-white transition-colors'>register</a> or <a href="/register" className='underline hover:text-white transition-colors'>login</a> to join the robotics club and participate in events.
                        </p>
                    </div>
                )}
                
                {/* Search and Filter Bar */}
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
                                <option value="thisWeek">This Week</option>
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
                
                {/* THIS WEEK SECTION - ALWAYS AT TOP */}
                <div className='w-full mb-12'>
                    <div className='w-full flex flex-col-reverse sm:flex-row justify-between sm:items-center mb-6'>
                        <h1 className='text-3xl font-bold text-[var(--primary)]'>👀 This Week</h1>
                        <ShinyText className='text-lg' text="This Week's Events" />
                    </div>
                    
                    {thisWeekEvents.length === 0 ? (
                        <div className='text-center py-16 border border-white/10 rounded-lg bg-black/20'>
                            <div className='text-2xl text-gray-400 mb-4'>📭 No events this week</div>
                            <p className='text-gray-500'>Check back soon for upcoming events!</p>
                        </div>
                    ) : (
                        <div className='w-full flex flex-wrap items-start justify-start z-20'>
                            {thisWeekEvents.map((event) => (
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
                    )}
                </div>
                
                {/* UPCOMING EVENTS SECTION */}
                {upcomingEvents.length > 0 && (
                    <div className='w-full mb-12'>
                        <div className='w-full flex flex-col-reverse sm:flex-row justify-between sm:items-center mb-6'>
                            <h1 className='text-2xl font-bold text-[rgb(155,155,155)]'>🚀 Upcoming Events</h1>
                            <ShinyText className='text-lg' text="Upcoming Events" />
                        </div>
                        
                        <div className='w-full flex flex-wrap items-start justify-start z-20'>
                            {upcomingEvents.map((event) => (
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
                )}
                
                {/* PAST EVENTS SECTION - MINIMAL AT BOTTOM */}
                {pastEvents.length > 0 && (
                    <div className='w-full'>
                        <div 
                            className='w-full flex items-center justify-between mb-6 cursor-pointer hover:text-[var(--primary)] transition-colors'
                            onClick={() => setShowPastEvents(!showPastEvents)}
                        >
                            <h1 className='text-xl font-bold text-gray-500'>📚 Past Events ({pastEvents.length})</h1>
                            {showPastEvents ? (
                                <FaChevronUp className="text-gray-500" />
                            ) : (
                                <FaChevronDown className="text-gray-500" />
                            )}
                        </div>
                        
                        {showPastEvents && (
                            <div className='w-full flex flex-wrap items-start justify-start z-20 opacity-60'>
                                {pastEvents.map((event) => (
                                    <div 
                                        key={event._id}
                                        className='sm:max-w-[250px] w-full sm:max-h-[350px] flex flex-col items-start justify-items-start bg-[rgb(13,13,13)] border-[rgb(29,29,29)] border-[1px] rounded-lg m-1 p-2 hover:cursor-pointer hover:border-gray-500/50 transition-all duration-300'
                                        onClick={() => handleEventView(event)}
                                    >
                                        <div className='w-full h-[250px] sm:h-[200px] bg-[rgb(19,19,19)] rounded-sm border-[1px] border-[rgb(29,29,29)] overflow-hidden'>
                                            <img 
                                                className='w-full h-full object-cover hover:scale-105 transition-transform duration-300 grayscale' 
                                                src={event.image} 
                                                alt={event.title}
                                                onError={(e) => {
                                                    e.target.src = 'https://i.pinimg.com/736x/c3/a9/27/c3a927ca97d4f83d7918e4a4cd2deb0d.jpg';
                                                }}
                                            />
                                        </div>
                                        <div className='w-full flex flex-col p-1'>
                                            <p className='mt-2 text-lg font-bold text-gray-500 leading-tight'>
                                                {event.title}
                                            </p>
                                            <div className='w-full flex justify-between items-center mt-2'>
                                                <p className='text-xs font-bold text-gray-500 leading-tight'>
                                                    {event.venue}
                                                </p>
                                                <p className='text-gray-500/60 px-2 border border-gray-500/20 bg-black rounded-lg text-xs'>
                                                    {formatDate(event.date)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                
                {/* NO EVENTS MESSAGE */}
                {events.length === 0 && (
                    <div className='text-center py-16'>
                        <div className='text-2xl text-gray-400 mb-4'>No events available</div>
                        <p className='text-gray-500'>Events will appear here once they are created</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default page
