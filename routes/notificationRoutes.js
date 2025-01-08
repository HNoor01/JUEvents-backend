const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notificationController');

// Add notification
router.post('/', notificationController.addNotification);

// Get all notifications for a specific student
router.get('/:student_id', notificationController.getNotificationsByStudent);

// Mark multiple notifications as read
router.patch('/mark-as-read', notificationController.markMultipleAsRead);

// Mark a single notification as read
router.patch('/:id', notificationController.markAsRead);

// Get unread notification count
router.get('/:student_id/unread', notificationController.getUnreadNotificationsCount);


module.exports = router;
