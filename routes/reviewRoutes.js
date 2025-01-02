const express = require('express');
const router = express.Router();
const reviewController = require('../controller/reviewController');

router.post('/events/:event_id/reviews', reviewController.addReview);
router.get('/events/:event_id/reviews', reviewController.getEventReviews);

module.exports = router;
