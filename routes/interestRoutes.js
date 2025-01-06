const express = require('express');
const router = express.Router();

const {addInterest} = require('../controller/interestController');



router.post('/:eventId', addInterest);
module.exports = router;