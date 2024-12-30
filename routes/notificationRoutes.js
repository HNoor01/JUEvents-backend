const express = require('express');
const { addNotification, 
   // markAsRead, 
    getNotificationsByStudent } = require('../controller/notificationController');

const router = express.Router();
router.post('/', addNotification);
//router.patch('/:id', markAsRead);
router.get('/:student_id', getNotificationsByStudent);
module.exports = router;
