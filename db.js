const { Sequelize } = require('sequelize');

// Initialize Sequelize with MySQL connection
const sequelize = new Sequelize('JUEvents', 'root', 'JUEventsPassword', {
    host: 'localhost',
    dialect: 'mysql',
});

// Test the connection
sequelize
    .authenticate()
    .then(() => console.log('MySQL connected successfully'))
    .catch((err) => console.error('Unable to connect to MySQL:', err));

module.exports = sequelize;
