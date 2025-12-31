const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { 
    getAllEvents, 
    getEventById, 
    createEvent, 
    updateEvent, 
    deleteEvent,
    getEventsByStatus,
    updateEventStatus
} = require('../controllers/eventController');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed'));
    }
});

// Get all events
router.get('/', getAllEvents);

// Get single event by ID
router.get('/:id', getEventById);

// Get events by status
router.get('/status/:status', getEventsByStatus);

// Update event status (Admin only)
router.patch('/:id/status', authenticateToken, requireRole(['admin', 'officebearer']), updateEventStatus);

// Upload event image
router.post('/upload-image', authenticateToken, requireRole(['admin', 'officebearer']), upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }
        
        // Return the image URL (serving from backend)
        const imageUrl = `http://localhost:8080/uploads/${path.basename(req.file.path)}`;
        
        res.json({
            success: true,
            message: 'Image uploaded successfully',
            imageUrl: imageUrl
        });
    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({ message: 'Failed to upload image' });
    }
});

// Create new event (admin or officebearer only)
router.post('/', authenticateToken, requireRole(['admin', 'officebearer']), createEvent);

// Update event
router.put('/:id', authenticateToken, requireRole(['admin', 'officebearer']), updateEvent);

// Delete event
router.delete('/:id', authenticateToken, requireRole(['admin']), deleteEvent);

module.exports = router;

