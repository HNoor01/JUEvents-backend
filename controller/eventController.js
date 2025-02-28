const Event = require('../models/event.js');
const Notification = require('../models/notification.js');
const Students = require("../models/students.js");
const multer = require('multer');

const allowedLocations = ['Nursing', 'Sciences', 'Sharia', 'Medicine',"Arts",
    'Agriculture','Physical Education','IT','Business','Languages','Engineering','Archeology and Tourism',
    'Sports Sciences','International Studies','Educational Sciences','Arts and Design','Dental','Rehabilitation','Rights'];

const validateTime = (time) => {
    const [hour] = time.split(':').map(Number);
    return hour >= 8 && hour < 16;
};

const createEventRequest = async (req, res) => {
    const { name, date, time, location, description, image } = req.body;
    let imageUrl = image || null;

    try {
        const student_id = req.session.student_id;

        if (!student_id) {
            return res.status(401).json({ error: 'Unauthorized. Please log in.' });
        }

        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`; // Save only the relative path in the database
        }
        console.log("Image URL saved in database:", imageUrl);

        if (!name || !location || !time || !date) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        if (!allowedLocations.includes(location)) {
            return res.status(400).json({ error: 'Invalid location. Choose a valid location.' });
        }

        if (!validateTime(time)) {
            return res.status(400).json({ error: 'Event time must be between 08:00 AM and 04:00 PM.' });
        }

        const eventDate = new Date(date);
        const currentDate = new Date();
        if (eventDate < currentDate) {
            return res.status(400).json({ error: 'Date must not be in the past.' });
        }

        const dayOfWeek = eventDate.getDay();
        if (dayOfWeek === 5 || dayOfWeek === 6) {
            return res.status(400).json({ error: 'Events cannot be scheduled on Friday or Saturday.' });
        }

        const existingEvent = await Event.findOne({
            where: {
                location: location,
                time: time,
                date: date,
            },
        });

        if (existingEvent) {
            return res.status(400).json({ error: 'This time and location are already booked for an event on this date.' });
        }

        // Generate a unique attendance code
        const attendanceCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const newEvent = await Event.create({
            name,
            description,
            location,
            time,
            date,
            created_by: student_id,
            status: 'Pending',
            image: imageUrl,
            attendanceCode, // Add the attendance code
        });

        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Error creating event request:', error);
        res.status(500).json({ error: error.message || 'Failed to create event request.' });
    }
};

const getAllEvents = async (req, res) => {
    try {
        const events = await Event.findAll(); // Fetch events from the database

        // Map the events and prepend the base URL to the image path
        const updatedEvents = events.map(event => ({
            ...event.toJSON(),
            image: event.image ? `http://192.168.0.129:3000${event.image}` : null, // Dynamically prepend base URL
        }));
        console.log("Events fetched with updated image URLs:", updatedEvents);

        res.status(200).json(updatedEvents); // Send updated events with full image URLs
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events.' });
    }
};


const getAllEventsAdmin = async (req, res) => {
    try {
        const events = await Event.findAll();

        // Create a map to store events by month
        const eventsByMonth = new Map();

        const monthEvents = {
            "January": 0, "February": 0, "March": 0, "April": 0,
            "May": 0, "June": 0, "July": 0, "August": 0,
            "September": 0, "October": 0, "November": 0, "December": 0
        };

        // Loop through events to count them by month
        events.forEach(event => {
            const eventDate = new Date(event.date);
            const monthIndex = eventDate.getMonth();

            const monthName = Object.keys(monthEvents)[monthIndex];
            monthEvents[monthName]++;
        });

        res.status(200).json(monthEvents);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events.' });
    }
};


const viewEventDetails = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const updatedEvent = {
            ...event.toJSON(),
                        status: event.status || 'Pending', // Default to 'Pending'
            image: event.image ? `http://192.168.0.129:3000${event.image}` : null, // Dynamically prepend base URL
        };

        console.log("Event details fetched with updated image URL:", updatedEvent);
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};





const validateAttendanceCode = async (req, res) => {
    const { eventId } = req.params;
    const { attendanceCode } = req.body;

    try {
        const event = await Event.findByPk(eventId);

        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        if (event.attendanceCode !== attendanceCode) {
            return res.status(400).json({ error: 'Invalid attendance code.' });
        }

        res.status(200).json({ message: 'Attendance confirmed.' });
    } catch (error) {
        console.error('Error validating attendance code:', error);
        res.status(500).json({ error: 'Failed to validate attendance code.' });
    }
};
const respondToEventRequest = async (req, res) => {
    try {
        const { eventId, status, notes } = req.body;

        // Validate input
        if (!eventId || !status) {
            return res.status(400).json({ error: 'Event ID and status are required.' });
        }

        // Find the event by ID
        const event = await Event.findByPk(eventId);

        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        // Update the event status and response notes
        event.status = status;
        event.response_notes = status === 'Rejected' ? notes : null;
        event.responded_at = new Date();
        await event.save();

        // Debug: Check event data before creating notification
        console.log('Event Data:', event);

        // Create a notification linked to the event
        if (event.created_by) {
            await Notification.create({
                student_id: event.created_by, // Link notification to the student who created the event
                message: `Your event "${event.name}" has been ${status.toLowerCase()}.`,
                notification_type: `event_${status.toLowerCase()}`, // e.g., event_approved or event_rejected
                event_id: event.id, // Link the notification to the event
                is_read: false,
            });
        }

        res.status(200).json({ message: `Event has been ${status.toLowerCase()}.`, event });
    } catch (error) {
        console.error('Error responding to event:', error);
        res.status(500).json({ error: 'Failed to update event status.' });
    }
};



module.exports = { createEventRequest, respondToEventRequest, viewEventDetails, getAllEvents, validateAttendanceCode, getAllEventsAdmin };
