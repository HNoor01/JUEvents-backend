const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const {
    getAllEvents,
    getAllEventsAdmin,
    createEventRequest,
    respondToEventRequest,
    viewEventDetails,
    validateAttendanceCode, // Ensure this is correctly imported
} = require('../controller/eventController');

// Route to fetch all events
router.get('/', getAllEvents);

// Route to fetch all events
router.get('/admin', getAllEventsAdmin);

// Route to create an event with image upload
router.post('/', upload.single('image'), createEventRequest);

// Route to respond to an event request
router.post('/respond', respondToEventRequest);

// Route to get details of a specific event
router.get('/:event_Id', viewEventDetails);

// Route to validate attendance code for a specific event
router.post('/:event_Id/validate-attendance', validateAttendanceCode);

module.exports = router;
