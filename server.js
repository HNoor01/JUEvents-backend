const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./models/database');
const eventRoutes = require('./routes/eventRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentsRoutes = require('./routes/studentsRoutes.js');
const notificationRoutes = require('./routes/notificationRoutes');
const interestRoutes = require('./routes/interestRoutes');
const setupSession = require('./sessionConfig');
const app = express();
setupSession(app);
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Event Management API!');
});
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/students', studentsRoutes); 
app.use('/api/reviews', reviewRoutes);
app.use('/api/interests', interestRoutes);
const PORT = 3000;
sequelize.authenticate()
  .then(() => {
    console.log('Database connected!');
    
    sequelize.sync({ alter: true })  
      .then(() => {
        console.log('Tables synced with the database!');
        app.listen(PORT, () => {
          console.log(`Server is running on http://localhost:${PORT}`);
        });
      })
      .catch(err => {
        console.error('Error syncing tables:', err);
      });
  })
  .catch(error => {
    console.error('Failed to connect to the database:', error);
  });
  
