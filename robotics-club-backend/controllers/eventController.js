// Production logging utility
const log = {
    info: (component, message) => console.log(`[INFO] [${component}] ${message}`),
    warn: (component, message) => console.warn(`[WARN] [${component}] ${message}`),
    error: (component, message) => console.error(`[ERROR] [${component}] ${message}`),
    request: (method, path, userId) => console.log(`[REQUEST] [${method}] ${path} - User: ${userId || 'anonymous'}`)
};

const EventModel = require("../models/eventModel")

// Get all events
const getAllEvents = async (req, res) => {
    try {
        const events = await EventModel.find({})
            .populate('createdBy', 'name email role')
            .sort({ date: 1 })
        
        log.info('EVENTS', `Fetched ${events.length} events`);
        res.status(200).json({
            success: true,
            count: events.length,
            events
        })
    } catch (error) {
        log.error('EVENTS', 'Failed to fetch events');
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// Get single event by ID
const getEventById = async (req, res) => {
    try {
        const event = await EventModel.findById(req.params.id)
            .populate('createdBy', 'name email role')
        
        if (!event) {
            log.warn('EVENTS', `Event not found: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            })
        }
        
        log.info('EVENTS', `Fetched event: ${event.title}`);
        res.status(200).json({
            success: true,
            event
        })
    } catch (error) {
        log.error('EVENTS', 'Failed to fetch event');
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// Create new event (Admin/OB only)
const createEvent = async (req, res) => {
    try {
        const { title, description, date, venue, host, image, status, maxParticipants, registrationRequired, eventType } = req.body
        
        // Validate required fields
        if (!title || !description || !date || !venue) {
            return res.status(400).json({
                success: false,
                message: 'Title, description, date, and venue are required'
            })
        }
        
        // Create event
        const event = await EventModel.create({
            title,
            description,
            date,
            venue,
            host: host || [],
            image: image || 'https://i.pinimg.com/736x/c3/a9/27/c3a927ca97d4f83d7918e4a4cd2deb0d.jpg',
            status: status || 'upcoming',
            maxParticipants: maxParticipants || null,
            registrationRequired: registrationRequired || false,
            eventType: eventType || 'other',
            createdBy: req.user._id
        })
        
        // Populate createdBy info
        await event.populate('createdBy', 'name email role')
        
        log.info('EVENTS', `Event created: ${title} by ${req.user.email}`);
        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            event
        })
    } catch (error) {
        log.error('EVENTS', 'Failed to create event');
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// Update event (Admin/OB only)
const updateEvent = async (req, res) => {
    try {
        const { title, description, date, venue, host, image, status, maxParticipants, registrationRequired, eventType } = req.body
        
        const event = await EventModel.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                date,
                venue,
                host,
                image,
                status,
                maxParticipants,
                registrationRequired,
                eventType,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        ).populate('createdBy', 'name email role')
        
        if (!event) {
            log.warn('EVENTS', `Event not found for update: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            })
        }
        
        log.info('EVENTS', `Event updated: ${title} by ${req.user.email}`);
        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            event
        })
    } catch (error) {
        log.error('EVENTS', 'Failed to update event');
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// Delete event (Admin only)
const deleteEvent = async (req, res) => {
    try {
        const event = await EventModel.findByIdAndDelete(req.params.id)
        
        if (!event) {
            log.warn('EVENTS', `Event not found for delete: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            })
        }
        
        log.info('EVENTS', `Event deleted: ${event.title} by ${req.user.email}`);
        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        })
    } catch (error) {
        log.error('EVENTS', 'Failed to delete event');
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// Get events by status
const getEventsByStatus = async (req, res) => {
    try {
        const { status } = req.params
        const validStatuses = ['upcoming', 'ongoing', 'completed', 'cancelled']
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be one of: upcoming, ongoing, completed, cancelled'
            })
        }
        
        const events = await EventModel.find({ status })
            .populate('createdBy', 'name email role')
            .sort({ date: 1 })
        
        log.info('EVENTS', `Fetched ${events.length} events with status: ${status}`);
        res.status(200).json({
            success: true,
            count: events.length,
            events
        })
    } catch (error) {
        log.error('EVENTS', 'Failed to fetch events by status');
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// Update event status (Admin/OB only)
const updateEventStatus = async (req, res) => {
    try {
        const { status } = req.body
        const validStatuses = ['upcoming', 'ongoing', 'completed', 'cancelled']
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be one of: upcoming, ongoing, completed, cancelled'
            })
        }
        
        const event = await EventModel.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: new Date() },
            { new: true }
        ).populate('createdBy', 'name email role')
        
        if (!event) {
            log.warn('EVENTS', `Event not found for status update: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            })
        }
        
        log.info('EVENTS', `Event status updated: ${event.title} to ${status}`);
        res.status(200).json({
            success: true,
            message: 'Event status updated successfully',
            event
        })
    } catch (error) {
        log.error('EVENTS', 'Failed to update event status');
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsByStatus,
    updateEventStatus
}

