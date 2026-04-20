const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Owner = sequelize.define('Owner', {
  resident_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Residents',
      key: 'resident_id'
    }
  },
  ownership_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, { tableName: 'Owners', timestamps: false });

const Tenant = sequelize.define('Tenant', {
  resident_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Residents',
      key: 'resident_id'
    }
  },
  rent: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  lease_start: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  lease_end: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, { tableName: 'Tenants', timestamps: false });

module.exports = { Owner, Tenant };
