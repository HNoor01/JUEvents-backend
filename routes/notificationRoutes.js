const express = require('express');
const { addNotification, getNotificationsByStudent, markAsRead } = require('../controller/notificationController');

const router = express.Router();
router.post('/', addNotification);
router.patch('/:id', markAsRead);
router.get('/students/:student_id', getNotificationsByStudent);
module.exports = router;
