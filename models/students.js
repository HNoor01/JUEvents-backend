const { DataTypes } = require('sequelize');
const sequelize = require('./database'); 
const Students = sequelize.define('Students', {
  student_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
   
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  college: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profile_picture: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
  
}, {
  tableName: 'students', 
  timestamps: false,
},

);

module.exports = Students;
