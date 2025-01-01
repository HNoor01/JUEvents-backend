const express = require('express');
const router = express.Router();

const {addInterest} = require('../controller/interestController');



router.post('/:event_Id', addInterest);
module.exports = router;