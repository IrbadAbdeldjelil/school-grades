const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Grade = sequelize.define('Grade', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.ENUM('male', 'female'),
        allowNull: false
    },
    semester: {
        type: DataTypes.ENUM('الاولى', 'الثانية', 'الاخيرة'),
        allowNull: false
    },
    academicYear: {
    type: DataTypes.STRING,
    allowNull: false
    // مثال: '2025-2026'
},
    islamic:  { type: DataTypes.INTEGER, allowNull: false },
    arabic:   { type: DataTypes.INTEGER, allowNull: false },
    math:     { type: DataTypes.INTEGER, allowNull: false },
    science:  { type: DataTypes.INTEGER, allowNull: false },
    civic:    { type: DataTypes.INTEGER, allowNull: false },
    french:   { type: DataTypes.INTEGER, allowNull: false },
    sport:    { type: DataTypes.INTEGER, allowNull: false },
    art:      { type: DataTypes.INTEGER, allowNull: false },
    conduct:  { type: DataTypes.INTEGER, allowNull: false },
    total:    { type: DataTypes.FLOAT,   allowNull: false },
    average:  { type: DataTypes.FLOAT,   allowNull: false },
    result:   { type: DataTypes.STRING,  allowNull: false },
    mention:  { type: DataTypes.STRING,  allowNull: false },
    rank:     { type: DataTypes.INTEGER, allowNull: true  },
});

module.exports = Grade;