const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const Event = require('./Event');

const Attendance = sequelize.define('Attendance', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('interested', 'going', 'not-going'),
        allowNull: false,
        defaultValue: 'interested',
    },
});

// Associations
Attendance.belongsTo(User, { foreignKey: 'userId' });
Attendance.belongsTo(Event, { foreignKey: 'eventId' });

module.exports = Attendance;
