const { DataTypes } = require('sequelize');
const sequelize = require('./database'); 
const Students = require('./students');

const Review = sequelize.define('Review', {
    review_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'students',  // تأكد من اسم الجدول الصحيح (case-sensitive)
            key: 'student_id'
        }
    },
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'events',  // تأكد من اسم الجدول الصحيح (case-sensitive)
            key: 'event_id'
        }
    },
    rating: {
        type: DataTypes.INTEGER,  // تم تصحيح الخطأ الإملائي هنا
        allowNull: false
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'reviews',  // تأكد من اسم الجدول في قاعدة البيانات
    timestamps: true  // استخدم true بدلاً من false إذا كنت تريد تتبع التواريخ
});

//Review.belongsTo(Students, { foreignKey: 'student_id' });

module.exports = Review;
