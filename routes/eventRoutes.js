const express = require('express');
const authenticate = require('../middleware/auth'); // Correct import for the auth middleware
const Event = require('../models/Event'); // Event model
const router = express.Router();
const jwt = require('jsonwebtoken');

// Create Event Route
router.post('/', authenticate, async (req, res) => {
    const { title, description, date, time, location } = req.body;

    try {
        // Create the event in the database
        const event = await Event.create({
            title,
            description,
            date,
            time,
            location,
            createdBy: req.user.id, // Set the user ID from the token
        });

        res.status(201).json({ message: 'Event created successfully', event });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

// Get All Events Route
router.get('/', authenticate, async (req, res) => {
    try {
        const events = await Event.findAll();
        res.json(events);
    } catch (err) {
        console.error(err);
        res.status(404).json({ message: 'Event not found' });
    }
});

module.exports = router;
