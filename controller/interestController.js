const Interest = require("../models/interest.js");
const Event = require('../models/event.js');  
const Students = require("../models/students.js");

const addInterest = async (req, res) => {
    try {
        
        const { event_Id } = req.params; // استخراج ID الحدث من الرابط
        const studentId = req.session.student_id; // استخراج ID المستخدم من الجلسة
        console.log(`Received eventId: ${event_Id}`);

        // تحقق من تسجيل الدخول
        if (!studentId) {
            return res.status(401).json({ error: 'Unauthorized. Please log in.' });
        }

        // تحقق من وجود الحدث
        const event = await Event.findByPk(event_Id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        // التحقق من انتهاء الحدث
        const eventDateTime = new Date(`${event.date}T${event.time}`);
        const currentDateTime = new Date();
        if (currentDateTime > eventDateTime) {
            return res.status(400).json({ error: 'Cannot add interest for an event that has already ended.' });
        }

        
       

        // إضافة الاهتمام مباشرة
        await Interest.create({
            student_id: studentId,
            event_id: event_Id,
            interest_date: new Date(),
        });

        // زيادة عدد المهتمين
        event.interest_count += 1;
        await event.save();

        return res.status(201).json({
            message: 'Interest added successfully.',
            interestCount: event.interest_count,
        });
    } catch (error) {
        console.error('Error adding interest:', error);
        res.status(500).json({ error: 'Failed to add interest for the event.' });
        
    }
};

module.exports = { addInterest };