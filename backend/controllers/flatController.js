const { Flat, Room, Parking, Furniture } = require('../models');

// @desc    Get all flats
// @route   GET /api/flats
// @access  Private/Admin
const getFlats = async (req, res) => {
  try {
    const flats = await Flat.findAll({
      include: [Room, Parking, Furniture]
    });
    res.json(flats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get basic info of all flats for public registration
// @route   GET /api/flats/public
// @access  Public
const getPublicFlats = async (req, res) => {
  try {
    const flats = await Flat.findAll({
      attributes: ['flat_id', 'flat_number', 'building_name', 'floor'],
      order: [['building_name', 'ASC'], ['flat_number', 'ASC']]
    });
    res.json(flats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a flat
// @route   POST /api/flats
// @access  Private/Admin
const createFlat = async (req, res) => {
  try {
    const { flat_number, floor, building_name, config_type, area_sqft, rooms } = req.body;

    const flat = await Flat.create({
      flat_number,
      floor,
      building_name,
      config_type,
      area_sqft
    });

    // If rooms are provided, create them
    if (rooms && Array.isArray(rooms)) {
      const roomData = rooms.map(room => ({ ...room, flat_id: flat.flat_id }));
      await Room.bulkCreate(roomData);
    }

    res.status(201).json(flat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single flat
// @route   GET /api/flats/:id
// @access  Private
const getFlatById = async (req, res) => {
  try {
    const flat = await Flat.findByPk(req.params.id, {
      include: [Room, Parking, Furniture]
    });

    if (!flat) {
      return res.status(404).json({ message: 'Flat not found' });
    }

    res.json(flat);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getFlats,
  createFlat,
  getFlatById,
  getPublicFlats
};
