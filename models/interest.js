const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const Students = require('./students');
const Event = require('./event');

const Interest = sequelize.define('Interest', {
    interest_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Students', // اسم الجدول المرتبط
            key: 'student_id', // المفتاح الأساسي في جدول الطلاب
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Events', // اسم الجدول المرتبط
            key: 'event_id', // المفتاح الأساسي في جدول الأحداث
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    interest_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'event_interests',
    timestamps: false, // إذا لم تكن بحاجة لـ createdAt و updatedAt
});
/*Students.hasMany(Interest, { foreignKey: 'student_id' });
Interest.belongsTo(Students, { foreignKey: 'student_id' });

Event.hasMany(Interest, { foreignKey: 'event_id' });
Interest.belongsTo(Event, { foreignKey: 'event_id' });*/

module.exports = Interest;
