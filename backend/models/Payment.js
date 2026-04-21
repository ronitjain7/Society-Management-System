const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Payment = sequelize.define('Payment', {
  payment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  maintenance_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Maintenance',
      key: 'maintenance_id'
    }
  },
  amount_paid: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  payment_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  payment_mode: {
    type: DataTypes.ENUM('Online', 'Cash', 'Cheque'),
    allowNull: false
  },
  transaction_id: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'Payments',
  timestamps: false
});

module.exports = Payment;
