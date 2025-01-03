const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('JUEvents', 'root','JUEventsPassword',  {
  host: 'localhost',
  port : 3306,
  dialect: 'mysql',
});

module.exports = sequelize;
