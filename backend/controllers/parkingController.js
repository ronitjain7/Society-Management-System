const { Parking, Vehicle, Flat } = require('../models');

// @desc    Auto-assign parking to a vehicle
// @route   POST /api/parking/assign
// @access  Private/Admin
const assignParking = async (req, res) => {
  try {
    const { vehicle_id, parking_type } = req.body;

    // Find the vehicle
    const vehicle = await Vehicle.findByPk(vehicle_id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Find available parking of requested type or fallback
    const availableSpot = await Parking.findOne({
      where: {
        status: 'Available',
        parking_type: parking_type || 'Open'
      }
    });

    if (!availableSpot) {
      return res.status(400).json({ message: 'No available parking spots of this type' });
    }

    // Assign spot to vehicle
    vehicle.parking_id = availableSpot.parking_id;
    await vehicle.save();

    // Mark spot as occupied
    availableSpot.status = 'Occupied';
    await availableSpot.save();

    res.json({
      message: 'Parking assigned successfully',
      parking_number: availableSpot.parking_number,
      parking_type: availableSpot.parking_type
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all parking status
// @route   GET /api/parking
const getParkingStatus = async (req, res) => {
  try {
    const spots = await Parking.findAll({ include: [Flat] });
    res.json(spots);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  assignParking,
  getParkingStatus
};
