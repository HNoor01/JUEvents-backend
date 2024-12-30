const Students = require("../models/students.js");
const Interest = require("../models/interest.js");
const Event = require("../models/event.js");

const studentLogin = async (req, res) => {
  try {
    const { student_id, password } = req.body;

    if (!student_id || !password) {
      return res.status(400).json({ message: 'Student ID and password are required' });
    }
    const student = await Students.findOne({ where: { student_id } }); 
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    if (student.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    req.session.student_id = student_id; 
    return res.status(200).json({ message: 'Login successful', student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const viewInterests = async (req, res) => {
  try {
      const studentId = req.session.student_id; 
      if (!studentId) {
          return res.status(401).json({ error: 'Unauthorized. Please log in.' });
      }

      
      const interests = await Interest.findAll({
        include: [
            { model: Students, attributes: ['student_id', 'name'] },
            { model: Event, attributes: ['event_id', 'name', 'description'] }
        ]
    });
    console.log(interests);
    

      if (interests.length === 0) {
          return res.status(200).json({ message: 'No events found that you are interested in.' });
      }

    
      const events = interests.map(interest => interest.Event); 

      return res.status(200).json({ events });

  } catch (error) {
      console.error('Error fetching student interests:', error);
      return res.status(500).json({ error: 'Failed to fetch student interests.' });
  }
};
const viewProfile = async (req, res) => {
  try {
    
      const studentId = req.session.student_id; 

      
      if (!studentId) {
          return res.status(401).json({ error: 'Unauthorized. Please log in.' });
      }

     
      const student = await Students.findOne({
          where: { student_id: studentId },
          attributes: ['name', 'profile_picture'], 
      });

      if (!student) {
          return res.status(404).json({ error: 'Student not found.' });
      }

     
      return res.status(200).json({
          name: student.name,
          profile_picture: student.profile_picture,
      });
  } catch (error) {
      console.error('Error fetching student profile:', error);
      res.status(500).json({ error: 'Failed to fetch student profile.' });
  }
};


module.exports = { studentLogin,viewInterests,viewProfile };

