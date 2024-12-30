const express = require('express');
const router = express.Router();
const { studentLogin,viewInterests,viewProfile }= require('../controller/studentsController.js');
router.post('/login', studentLogin);  // api/students/login
router.get('/viewInterests', viewInterests);
router.get('/profile', viewProfile); 


module.exports = router;
