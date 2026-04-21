const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Complaint Model
const Complaint = sequelize.define('Complaint', {
  complaint_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  resident_id: { type: DataTypes.INTEGER, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.ENUM('Open', 'In Progress', 'Resolved', 'Closed'), defaultValue: 'Open' },
  priority: { type: DataTypes.ENUM('Low', 'Medium', 'High'), defaultValue: 'Medium' },
  complaint_type: { type: DataTypes.STRING },
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'Complaints', timestamps: false });

// Maintenance Model
const Maintenance = sequelize.define('Maintenance', {
  maintenance_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  flat_id: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  due_date: { type: DataTypes.DATEONLY, allowNull: false },
  payment_date: { type: DataTypes.DATEONLY },
  status: { type: DataTypes.ENUM('Unpaid', 'Paid', 'Partial', 'Overdue'), defaultValue: 'Unpaid' }
}, { tableName: 'Maintenance', timestamps: false });

// Notice Model
const Notice = sequelize.define('Notice', {
  notice_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'Notices', timestamps: false });

// Visitor Model
const Visitor = sequelize.define('Visitor', {
  visitor_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  flat_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  visit_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'Visitors', timestamps: false });

// Security Model
const Security = sequelize.define('Security', {
  staff_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  shift: { type: DataTypes.ENUM('Morning', 'Afternoon', 'Night'), allowNull: false }
}, { tableName: 'Security', timestamps: false });

// Entry Log Model
const EntryLog = sequelize.define('EntryLog', {
  entry_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  visitor_id: { type: DataTypes.INTEGER, allowNull: false },
  staff_id: { type: DataTypes.INTEGER, allowNull: false },
  entry_time: { type: DataTypes.DATE, allowNull: false },
  exit_time: { type: DataTypes.DATE }
}, { tableName: 'EntryLogs', timestamps: false });

// Furniture Model
const Furniture = sequelize.define('Furniture', {
  furniture_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  flat_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  furniture_type: { type: DataTypes.STRING }
}, { tableName: 'Furniture', timestamps: false });

module.exports = { Complaint, Maintenance, Notice, Visitor, Security, EntryLog, Furniture };
