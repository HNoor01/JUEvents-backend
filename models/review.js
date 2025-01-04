const { DataTypes } = require('sequelize');
const sequelize = require('./database'); 
const Students = require('./students');
const Events = require('./event'); // Ensure the events model is imported

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'students',
            key: 'student_id'
        }
    },
    photos: {
        type: DataTypes.TEXT, // To store comma-separated photo URIs
        allowNull: true,
    },

    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'events',
            key: 'id'
        }
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'reviews',
    timestamps: true
});

Review.belongsTo(Students, { foreignKey: 'student_id' });

module.exports = Review;
