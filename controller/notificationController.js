const Notification = require('../models/notification');

const addNotification = async (req, res) => {
  try {
    const { student_id, message, notification_type } = req.body;

    if (!student_id || !message || !notification_type) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const notification = await Notification.create({
      student_id,
      message,
      notification_type,
    });
    console.log('Notification created:', notification); // Log for debugging
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error adding notification:', error);
    res.status(500).json({ error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notification.is_read = true;
    await notification.save();
    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: error.message });
  }
};

const getNotificationsByStudent = async (req, res) => {
  try {
    const { student_id } = req.params;

    if (!student_id) {
      return res.status(400).json({ error: 'Student ID is missing' });
    }

    const notifications = await Notification.findAll({
      where: { student_id },
    });

    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ error: 'No notifications found for this student.' });
    }

    // Map database fields to frontend-friendly format
    const response = notifications.map((notification) => ({
      id: notification.id,
      studentId: notification.student_id,
      message: notification.message,
      notificationType: notification.notification_type,
      eventId: notification.event_id, // Map event_id to eventId
      isRead: notification.is_read,
      createdAt: notification.created_at,
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getUnreadNotificationsCount = async (req, res) => {
  try {
    const { student_id } = req.params;

    if (!student_id) {
      return res.status(400).json({ error: 'Student ID is missing.' });
    }

    const unreadCount = await Notification.count({
      where: { student_id, is_read: false },
    });

    res.status(200).json({ unreadCount });
  } catch (error) {
    console.error('Error fetching unread notifications count:', error);
    res.status(500).json({ error: 'Failed to fetch unread notifications count.' });
  }
};

const markMultipleAsRead = async (req, res) => {
  console.log('Request body:', req.body); // Log the incoming request body
  try {
    const { studentId } = req.body;

    if (!studentId) {
      console.log('No student ID provided.'); // Debugging log
      return res.status(400).json({ error: 'Student ID is required.' });
    }

    console.log('Student ID received:', studentId); // Debugging log

    // Fetch notifications for the student
    const notifications = await Notification.findAll({
      where: { student_id: studentId },
    });

    console.log('Notifications found:', notifications); // Log fetched notifications

    if (notifications.length === 0) {
      return res.status(404).json({ error: 'No notifications found for this student.' });
    }

    // Mark notifications as read
    await Notification.update(
        { is_read: true },
        { where: { student_id: studentId } }
    );

    res.status(200).json({ message: 'Notifications marked as read.' });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({ error: 'Failed to mark notifications as read.' });
  }
};




module.exports = {
  getUnreadNotificationsCount,
  markMultipleAsRead,
  addNotification,
  markAsRead,
  getNotificationsByStudent,
};
