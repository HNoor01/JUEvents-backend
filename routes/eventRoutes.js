const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const { createEventRequest, respondToEventRequest, viewEventDetails } = require('../controller/eventController.js');

router.post('/', upload.single('image'), createEventRequest);
router.post('/respond', respondToEventRequest);
router.get('/:event_Id', viewEventDetails);

module.exports = router;
