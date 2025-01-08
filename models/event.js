const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('./database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: Sequelize.NOW,
  },
  attendanceCode: {

    type: DataTypes.STRING,
    allowNull: false,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  event_type: {
    type: DataTypes.ENUM,
    values: ['Activity', 'Community Service', 'other'], 
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  interest_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  request_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  requested_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  response_notes : {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  responded_at : {
    type: DataTypes.DATE,
    allowNull: true,
  },
  responded_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM,
    values: ['Pending', 'Approved', 'Rejected'], 
    defaultValue: 'Pending',
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
}, {
  tableName: 'events', 
  timestamps: false, 
});


module.exports = Event;
