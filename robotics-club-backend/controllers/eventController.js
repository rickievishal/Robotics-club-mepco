const EventModel = require("../models/eventModel")

// Get all events
const getAllEvents = async (req, res) => {
    try {
        const events = await EventModel.find({})
            .populate('createdBy', 'name email role')
            .sort({ date: 1 }) // Sort by date ascending
        
        res.status(200).json({
            success: true,
            count: events.length,
            events
        })
    } catch (error) {
        console.error('Error fetching events:', error)
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
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            })
        }
        
        res.status(200).json({
            success: true,
            event
        })
    } catch (error) {
        console.error('Error fetching event:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// Create new event (Admin only)
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
        
        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            event
        })
    } catch (error) {
        console.error('Error creating event:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// Update event (Admin only)
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
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            })
        }
        
        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            event
        })
    } catch (error) {
        console.error('Error updating event:', error)
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
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            })
        }
        
        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        })
    } catch (error) {
        console.error('Error deleting event:', error)
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
        
        res.status(200).json({
            success: true,
            count: events.length,
            events
        })
    } catch (error) {
        console.error('Error fetching events by status:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// Update event status (Admin only)
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
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            })
        }
        
        res.status(200).json({
            success: true,
            message: 'Event status updated successfully',
            event
        })
    } catch (error) {
        console.error('Error updating event status:', error)
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

