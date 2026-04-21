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
    allowNull: false
  },
  floor: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  block: {
    type: DataTypes.ENUM('A', 'B', 'C', 'D'),
    allowNull: false
  },
  building_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('1BHK', '2BHK', '3BHK', '4BHK', 'Penthouse'),
    allowNull: false
  },
  area_sqft: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'Flats',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Flat;
