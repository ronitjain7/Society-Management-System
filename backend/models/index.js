const { sequelize } = require('../config/db');
const Flat = require('./Flat');
const Resident = require('./Resident');
const { Owner, Tenant } = require('./Specializations');
const { Room, Parking, Vehicle, Facility, Booking } = require('./Core');
const { Complaint, Maintenance, Notice, Visitor, Security, EntryLog, Furniture } = require('./Supporting');

// Associations

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

Flat.hasMany(Parking, { foreignKey: 'flat_id', onDelete: 'SET NULL' });
Parking.belongsTo(Flat, { foreignKey: 'flat_id' });

Flat.hasMany(Maintenance, { foreignKey: 'flat_id', onDelete: 'CASCADE' });
Maintenance.belongsTo(Flat, { foreignKey: 'flat_id' });

Flat.hasMany(Furniture, { foreignKey: 'flat_id', onDelete: 'CASCADE' });
Furniture.belongsTo(Flat, { foreignKey: 'flat_id' });

// Vehicles
Resident.hasMany(Vehicle, { foreignKey: 'resident_id', onDelete: 'CASCADE' });
Vehicle.belongsTo(Resident, { foreignKey: 'resident_id' });

Parking.hasOne(Vehicle, { foreignKey: 'parking_id', onDelete: 'SET NULL' });
Vehicle.belongsTo(Parking, { foreignKey: 'parking_id' });

// Bookings
Resident.hasMany(Booking, { foreignKey: 'resident_id', onDelete: 'CASCADE' });
Booking.belongsTo(Resident, { foreignKey: 'resident_id' });

Facility.hasMany(Booking, { foreignKey: 'facility_id', onDelete: 'CASCADE' });
Booking.belongsTo(Facility, { foreignKey: 'facility_id' });

// Complaints
Resident.hasMany(Complaint, { foreignKey: 'resident_id', onDelete: 'CASCADE' });
Complaint.belongsTo(Resident, { foreignKey: 'resident_id' });

// Visitors and Security
Flat.hasMany(Visitor, { foreignKey: 'flat_id', onDelete: 'CASCADE' });
Visitor.belongsTo(Flat, { foreignKey: 'flat_id' });

Visitor.hasMany(EntryLog, { foreignKey: 'visitor_id', onDelete: 'CASCADE' });
EntryLog.belongsTo(Visitor, { foreignKey: 'visitor_id' });

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
