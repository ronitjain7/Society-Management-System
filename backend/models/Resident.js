const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Resident = sequelize.define('Resident', {
  resident_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
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
  ownership_type: {
    type: DataTypes.ENUM('Owner', 'Tenant'),
    defaultValue: 'Owner'
  },
  flat_id: {
    type: DataTypes.INTEGER,
    unique: true,
    references: {
      model: 'Flats',
      key: 'flat_id'
    }
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    defaultValue: 'Active'
  },
  move_in_date: {
    type: DataTypes.DATEONLY
  }
}, {
  tableName: 'Residents',
  timestamps: false // Matching schema which uses created_at timestamp
});

module.exports = Resident;
