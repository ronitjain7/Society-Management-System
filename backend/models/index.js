const { sequelize } = require('../config/db');
const Flat = require('./Flat');
const Resident = require('./Resident');
const { Owner, Tenant } = require('./Specializations');
const { Room, Parking, Vehicle, Facility, Booking } = require('./Core');
const { Complaint, Maintenance, Notice, Visitor, Security, EntryLog, Furniture } = require('./Supporting');
const Payment = require('./Payment');

// Associations

// Maintenance Payments
Maintenance.hasMany(Payment, { foreignKey: 'maintenance_id', as: 'payments' });
Payment.belongsTo(Maintenance, { foreignKey: 'maintenance_id' });

// Resident Specialization (ISA)
Resident.hasOne(Owner, { foreignKey: 'resident_id', onDelete: 'CASCADE' });
Owner.belongsTo(Resident, { foreignKey: 'resident_id' });

Resident.hasOne(Tenant, { foreignKey: 'resident_id', onDelete: 'CASCADE' });
Tenant.belongsTo(Resident, { foreignKey: 'resident_id' });

// Resident lebt in Flat
Flat.hasMany(Resident, { foreignKey: 'flat_id', as: 'residents' });
Resident.belongsTo(Flat, { foreignKey: 'flat_id', as: 'flats' });

// Flat Components
Flat.hasMany(Room, { foreignKey: 'flat_id', onDelete: 'CASCADE' });
Room.belongsTo(Flat, { foreignKey: 'flat_id' });

Flat.hasMany(Parking, { foreignKey: 'flat_id', as: 'parkings', onDelete: 'SET NULL' });
Parking.belongsTo(Flat, { foreignKey: 'flat_id', as: 'flats' });

Flat.hasMany(Maintenance, { foreignKey: 'flat_id', as: 'maintenances', onDelete: 'CASCADE' });
Maintenance.belongsTo(Flat, { foreignKey: 'flat_id', as: 'flats' });

Flat.hasMany(Furniture, { foreignKey: 'flat_id', as: 'furnitures', onDelete: 'CASCADE' });
Furniture.belongsTo(Flat, { foreignKey: 'flat_id', as: 'flats' });

// Vehicles
Resident.hasMany(Vehicle, { foreignKey: 'resident_id', as: 'vehicles', onDelete: 'CASCADE' });
Vehicle.belongsTo(Resident, { foreignKey: 'resident_id', as: 'residents' });

Parking.hasOne(Vehicle, { foreignKey: 'parking_id', as: 'vehicle', onDelete: 'SET NULL' });
Vehicle.belongsTo(Parking, { foreignKey: 'parking_id', as: 'parking' });

// Bookings
Resident.hasMany(Booking, { foreignKey: 'resident_id', as: 'bookings', onDelete: 'CASCADE' });
Booking.belongsTo(Resident, { foreignKey: 'resident_id', as: 'residents' });

Facility.hasMany(Booking, { foreignKey: 'facility_id', as: 'bookings', onDelete: 'CASCADE' });
Booking.belongsTo(Facility, { foreignKey: 'facility_id', as: 'facilities' });

// Complaints
Resident.hasMany(Complaint, { foreignKey: 'resident_id', as: 'complaints', onDelete: 'CASCADE' });
Complaint.belongsTo(Resident, { foreignKey: 'resident_id', as: 'residents' });

// Visitors and Security
Flat.hasMany(Visitor, { foreignKey: 'flat_id', as: 'visitors', onDelete: 'CASCADE' });
Visitor.belongsTo(Flat, { foreignKey: 'flat_id', as: 'flats' });

Visitor.hasMany(EntryLog, { foreignKey: 'visitor_id', as: 'logs', onDelete: 'CASCADE' });
EntryLog.belongsTo(Visitor, { foreignKey: 'visitor_id', as: 'visitors' });

Security.hasMany(EntryLog, { foreignKey: 'staff_id', onDelete: 'CASCADE' });
EntryLog.belongsTo(Security, { foreignKey: 'staff_id' });

module.exports = {
  sequelize,
  Flat,
  Resident,
  Owner,
  Tenant,
  Room,
  Parking,
  Vehicle,
  Facility,
  Booking,
  Complaint,
  Maintenance,
  Notice,
  Visitor,
  Security,
  EntryLog,
  Furniture
};
