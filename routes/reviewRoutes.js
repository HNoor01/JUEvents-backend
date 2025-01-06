const express = require('express');
const router = express.Router();
const reviewController = require('../controller/reviewController');

router.get('/:eventId/reviews', reviewController.getEventReviews);
router.post('/:eventId/reviews', reviewController.addReview);

module.exports = router;
