const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./models/database');
const eventRoutes = require('./routes/eventRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentsRoutes = require('./routes/studentsRoutes.js');
const reviewRoutes = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const interestRoutes = require('./routes/interestRoutes');
const setupSession = require('./sessionConfig');
const cors = require('cors');
const app = express();
const path = require('path');

// Middleware
app.use(bodyParser.json());
app.use(cors());

setupSession(app);

// Default Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Event Management API!' });
});
app.get('/api', (req, res) => {
    res.json({ message: 'API is working. Available routes: /api/notifications, /api/students, /api/events, etc.' });
});

// API Routes
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/interests', interestRoutes);
app.use('/api/reviews', reviewRoutes);


// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve the uploads folder
console.log("Static uploads folder served at /uploads");
// Port
const PORT = 3000;

// Database Connection
sequelize.authenticate()
    .then(() => {
        console.log('Database connected!');
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log('Tables synced with the database!');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error initializing the application:', err);
    });
