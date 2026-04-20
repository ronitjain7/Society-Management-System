const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Room Model
const Room = sequelize.define('Room', {
  room_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  flat_id: { type: DataTypes.INTEGER, allowNull: false },
  room_type: { type: DataTypes.STRING, allowNull: false },
  size: { type: DataTypes.DECIMAL(10, 2) }
}, { tableName: 'Rooms', timestamps: false });

// Parking Model
const Parking = sequelize.define('Parking', {
  parking_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  parking_number: { type: DataTypes.STRING, unique: true, allowNull: false },
  parking_type: { type: DataTypes.ENUM('Covered', 'Open', 'Basement'), allowNull: false },
  flat_id: { type: DataTypes.INTEGER },
  status: { type: DataTypes.ENUM('Available', 'Occupied'), defaultValue: 'Available' }
}, { tableName: 'Parking', timestamps: false });

// Vehicle Model
const Vehicle = sequelize.define('Vehicle', {
  vehicle_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  vehicle_number: { type: DataTypes.STRING, unique: true, allowNull: false },
  vehicle_type: { type: DataTypes.ENUM('Car', 'Bike', 'Bicycle', 'Other'), allowNull: false },
  resident_id: { type: DataTypes.INTEGER, allowNull: false },
  parking_id: { type: DataTypes.INTEGER, unique: true }
}, { tableName: 'Vehicles', timestamps: true });

// Facility Model
const Facility = sequelize.define('Facility', {
  facility_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  capacity: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'Facilities', timestamps: false });

// Booking Model
const Booking = sequelize.define('Booking', {
  booking_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  resident_id: { type: DataTypes.INTEGER, allowNull: false },
  facility_id: { type: DataTypes.INTEGER, allowNull: false },
  booking_date: { type: DataTypes.DATEONLY, allowNull: false },
  time_slot: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM('Confirmed', 'Cancelled', 'Completed'), defaultValue: 'Confirmed' }
}, { tableName: 'Bookings', timestamps: true });

module.exports = { Room, Parking, Vehicle, Facility, Booking };
