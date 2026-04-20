const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Resident = sequelize.define('Resident', {
  resident_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  resident_type: {
    type: DataTypes.ENUM('Owner', 'Tenant', 'Admin'),
    allowNull: false
  },
  flat_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Flats',
      key: 'flat_id'
    }
  }
}, {
  tableName: 'Residents',
  timestamps: true
});

module.exports = Resident;
