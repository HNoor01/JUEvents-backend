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

    const notifications = await Notification.findAll({ where: { student_id } });

    if (!notifications || notifications.length === 0) {
      return res.status(200).json([]); // Return an empty array if no notifications exist
    }

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { addNotification, markAsRead, getNotificationsByStudent };
