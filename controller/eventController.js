const Event = require('../models/event.js');  
const Notification = require('../models/notification.js'); 
const Students = require("../models/students.js");


const allowedLocations = ['Nursing', 'Sciences', 'Sharia', 'Medicine',"Arts",'Agriculture','Physical Education','IT','Business','Languages','Engineering','Archeology and Tourism','Sports Sciences','International Studies','Educational Sciences','Arts and Design','Dental','Rehabilitation','Rights' ];
const validateTime = (time) => {
    const [hour, minute] = time.split(':').map(Number);
    return hour >= 8 && hour < 16;
};

const createEventRequest = async (req, res) => {
    try {
        const { name, description, location, time, date } = req.body;

      
        const student_id = req.session.student_id;

        
        if (!student_id) {
            return res.status(401).json({ error: 'Unauthorized. Please log in.' });
        }

        
        if (!name || !location || !time || !date) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        
        if (!allowedLocations.includes(location)) {
            return res.status(400).json({ error: 'Invalid location. Choose a valid location.' });
        }

       
        if (!validateTime(time)) {
            return res.status(400).json({ error: 'Event time must be between 08:00 AM and 04:00 PM.' });
        }

        const eventDate = new Date(date);
        const currentDate = new Date();
        if (eventDate < currentDate) {
            return res.status(400).json({ error: 'Date must not be in the past.' });
        }

        
        const dayOfWeek = eventDate.getDay();
        if (dayOfWeek === 5 || dayOfWeek === 6) {
            return res.status(400).json({ error: 'Events cannot be scheduled on Friday or Saturday.' });
        }

        
        const existingEvent = await Event.findOne({
            where: {
                location: location,
                time: time,
                date: date
            }
        });

        if (existingEvent) {
            return res.status(400).json({ error: 'This time and location are already booked for an event on this date.' });
        }

        
        let imageUrl = null;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        // إنشاء حدث جديد
        const newEvent = await Event.create({
            name,
            description,
            location,
            time,
            date,
            created_by: student_id, // استخدام student_id من الجلسة
            status: 'Pending',
            image: imageUrl,
        });

        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Error creating event request:', error);
        res.status(500).json({ error: error.message || 'Failed to create event request.' });
    }
};





/*const getHomePageEvents = async (req, res) => {
    try {
       
        const currentDate = new Date();
        
      
        const college = req.Students.college;

       
        const forYouEvents = await Event.findAll({
            where: {
                status: 'Approved', // 
                date: { [Op.gte]: currentDate }, 
                faculty: userFaculty,
            },
            order: [['date', 'ASC']], 
        });

        // جلب جميع الأحداث الجامعية المستقبلية
        const uniWideEvents = await Event.findAll({
            where: {
                status: 'Approved', // الحالة: موافق عليها
                date: { [Op.gte]: currentDate }, 
            },
            order: [['date', 'ASC']],
        });

        // إعداد الاستجابة بصيغة منظمة
        res.status(200).json({
            forYou: forYouEvents,
            uniWideEvents,
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to load events.' });
    }
};*/




const viewEventDetails = async (req, res) => {
    try {
      const event = await Event.findByPk(req.params.event_Id);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  
 





const respondToEventRequest = async (req, res) => {
    try {
        const { eventId, status, adminId, responseNotes, eventType } = req.body;

      
        if (!eventId || !status || !adminId || !eventType) {
            return res.status(400).json({ 
                error: 'Event ID, status, admin ID, and event type are required.' 
            });
        }

        
        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status. Use "Approved" or "Rejected".' });
        }

      
        if (!['Activity', 'Community Service', 'other'].includes(eventType)) {
            return res.status(400).json({ error: 'Invalid event type. Use "Activity", "Community Service", or "other".' });
        }

        
        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        
        event.status = status;
        event.responded_by = adminId;
        event.responded_at = new Date();
        event.response_notes = responseNotes || null;
        event.event_type = eventType;

        await event.save();

        
        try {
            await Notification.create({
                student_id: event.created_by, // ID الطالب الذي قدم الطلب
                message: `Your event "${event.name}" has been ${status.toLowerCase()}.`, // رسالة الإشعار
                notification_type: status === 'Approved' ? 'event_approved' : 'event_rejected', // نوع الإشعار
                created_at: new Date(),
                is_read: false,
            });
        } catch (notificationError) {
            console.error('Error sending notification:', notificationError);
            return res.status(500).json({ 
                error: 'Event updated, but failed to send notification.' 
            });
        }

        res.status(200).json({ 
            message: 'Event response updated successfully, and notification sent.', 
            event 
        });
    } catch (error) {
        console.error('Error responding to event request:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to respond to event request.' 
        });
    }
};








module.exports = { createEventRequest, respondToEventRequest, viewEventDetails
   // getHomePageEvents 
};
