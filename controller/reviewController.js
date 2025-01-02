const Review = require('../models/review');
const Event = require('../models/event');
const Student = require('../models/students');

const addReview = async (req, res) => {
    try {
        const { event_id } = req.params;
        const { rating, comment } = req.body;
        const student_id = req.session.student_id;

        if (!student_id) {
            return res.status(401).json({ error: 'Unauthorized. Please log in.' });
        }

        const event = await Event.findByPk(event_id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        const existingReview = await Review.findOne({ where: { student_id, event_id } });
        if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this event.' });
        }

        const newReview = await Review.create({
            student_id,
            event_id,
            rating,
            comment
        });

        res.status(201).json(newReview);
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ error: 'Failed to add review.' });
    }
};


const getEventReviews = async (req, res) => {
    try {
        const { event_id } = req.params;

        const event = await Event.findByPk(event_id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        const reviews = await Review.findAll({
            where: { event_id },
            include: [{ model: Student, attributes: ['name'] }]
        });

        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews.' });
    }
};

module.exports = {
    addReview,
    getEventReviews
};
