const express = require('express');
const router = express.Router();
const reviewController = require('../controller/reviewController');

router.get('/:event_id/reviews', reviewController.getEventReviews);
router.post('/:event_id/reviews', reviewController.addReview);


module.exports = router;
