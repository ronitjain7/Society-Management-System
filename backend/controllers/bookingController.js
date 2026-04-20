const { Booking, Facility, Resident } = require('../models');

// @desc    Get all bookings
// @route   GET /api/bookings
const getBookings = async (req, res) => {
  try {
    let whereClause = {};
    if (req.user.resident_type !== 'Admin') {
      whereClause = { resident_id: req.user.resident_id };
    }

    const bookings = await Booking.findAll({
      where: whereClause,
      include: [Facility]
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { facility_id, booking_date, time_slot } = req.body;

    // Check for existing booking (handled by DB UNIQUE constraint, but good to check here)
    const existingBooking = await Booking.findOne({
      where: { facility_id, booking_date, time_slot }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'This slot is already booked' });
    }

    const booking = await Booking.create({
      resident_id: req.user.resident_id,
      facility_id,
      booking_date,
      time_slot,
      status: 'Confirmed'
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    // Only Admin or the owner of the booking can cancel
    if (req.user.resident_type !== 'Admin' && booking.resident_id !== req.user.resident_id) {
      return res.status(401).json({ message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'Cancelled';
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getBookings,
  createBooking,
  cancelBooking
};
