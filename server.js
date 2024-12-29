const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const eventRoutes = require('./routes/eventRoutes'); // Import eventRoutes
const app = express();
const userRoutes = require('./routes/userRoutes');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Basic route to test API
app.get('/', (req, res) => {
    res.send('Backend for JUEvents is running!');
});
app.use('/api/users', userRoutes); // Register userRoutes at /api/users
app.use('/api/events', eventRoutes); // Event-related routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const sequelize = require('./db');

sequelize.sync({ force: false }) // Set `force: true` to reset tables during development
    .then(() => {
        console.log('Database synced successfully');
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
    });

const User = require('./models/User');
const Event = require('./models/Event');
console.log(userRoutes);
