const Review = require('../models/review');
const Event = require('../models/event');
const Student = require('../models/students');

const addReview = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { name, rating, comment, photos, isAttended } = req.body;
        const student_id = req.session.student_id;

        if (!student_id) {
            return res.status(401).json({ error: 'Unauthorized. Please log in.' });
        }

        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        if (!isAttended) {
            return res.status(400).json({ error: 'You must attend the event to leave a review.' });
        }

        const existingReview = await Review.findOne({ where: { student_id, eventId } });
        if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this event.' });
        }

        const newReview = await Review.create({
            student_id,
            eventId,
            name,
            rating,
            comment,
            photos: photos.join(','),
        });

        res.status(201).json(newReview);
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ error: 'Failed to add review.' });
    }
};

const getEventReviews = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        const reviews = await Review.findAll({
            where: { eventId },
            include: [{ model: Student, attributes: ['name'] }],
        });

        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews.' });
    }
};

module.exports = { addReview, getEventReviews };

const validateAttendanceCode = async (req, res) => {
    const { eventId  } = req.params;
    const { attendanceCode } = req.body;
    try {
        const event = await Event.findByPk(eventId );

        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        // Compare the provided code with the event's attendance code
        if (event.attendanceCode !== attendanceCode) {
            return res.status(400).json({ error: 'Invalid attendance code.' });
        }

        res.status(200).json({ message: 'Attendance confirmed.' });
    } catch (error) {
        console.error('Error validating attendance code:', error);
        res.status(500).json({ error: 'Failed to validate attendance code.' });
    }
};
module.exports = {addReview, getEventReviews, validateAttendanceCode};
