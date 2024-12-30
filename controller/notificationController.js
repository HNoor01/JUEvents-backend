const Notification = require('../models/notification');

// إضافة إشعار جديد
const addNotification = async (req, res) => {
  try {
    const { student_id, message, notification_type } = req.body;

    // تحقق من صحة المدخلات
    if (!student_id || !message || !notification_type) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const notification = await Notification.create({
      student_id,
      message,
      notification_type,
    });
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error adding notification:', error);
    res.status(500).json({ error: error.message });
  }
};

// تحديث حالة قراءة الإشعار
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    // التحقق من وجود الإشعار
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await Notification.update({ is_read: true }, { where: { notification_id: id } });
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: error.message });
  }
};

// جلب جميع الإشعارات لمستخدم معين
const getNotificationsByStudent = async (req, res) => {
  try {
    const { student_id } = req.params;

 
    const notifications = await Notification.findAll({
      where: { student_id },
      order: [['created_at', 'DESC']],
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications for student:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addNotification, markAsRead, getNotificationsByStudent };

