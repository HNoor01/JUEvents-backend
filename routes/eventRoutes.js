const express = require('express');
const router = express.Router();
const { createEventRequest, respondToEventRequest,viewEventDetails,
  //  getHomePageEvents
 } = require('../controller/eventController.js');

router.post('/create', createEventRequest);
router.post('/respond', respondToEventRequest);
//router.get('/home', getHomePageEvents);
router.get('/:event_Id', viewEventDetails);


module.exports = router;
