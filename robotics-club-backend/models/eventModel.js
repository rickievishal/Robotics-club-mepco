const mongoose = require("mongoose")

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    venue: {
        type: String,
        required: true,
        trim: true
    },
    host: [{
        type: String,
        trim: true
    }],
    image: {
        type: String,
        default: 'https://i.pinimg.com/736x/c3/a9/27/c3a927ca97d4f83d7918e4a4cd2deb0d.jpg'
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'social-logins',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    maxParticipants: {
        type: Number,
        default: null
    },
    registrationRequired: {
        type: Boolean,
        default: false
    },
    eventType: {
        type: String,
        enum: ['workshop', 'competition', 'seminar', 'meeting', 'other'],
        default: 'other'
    }
})

// Update the updatedAt field before saving
EventSchema.pre('save', function(next) {
    this.updatedAt = new Date()
    next()
})

const EventModel = mongoose.model('events', EventSchema)

module.exports = EventModel

