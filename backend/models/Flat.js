const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Flat = sequelize.define('Flat', {
  flat_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  flat_number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  floor: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  building_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  config_type: {
    type: DataTypes.ENUM('1BHK', '2BHK', '3BHK', '4BHK', 'Penthouse'),
    allowNull: false
  },
  area_sqft: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'Flats',
  timestamps: true
});

module.exports = Flat;
