const { Resident, Flat, Owner, Tenant } = require('../models');

// @desc    Get all residents
// @route   GET /api/residents
// @access  Private/Admin
const getResidents = async (req, res) => {
  try {
    const residents = await Resident.findAll({
      include: [{ model: Flat, attributes: ['flat_id', 'flat_number', 'building_name', 'floor'] }],
      attributes: { exclude: ['password'] }
    });
    res.json(residents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single resident
// @route   GET /api/residents/:id
// @access  Private
const getResidentById = async (req, res) => {
  try {
    const resident = await Resident.findByPk(req.params.id, {
      include: [{ model: Flat, attributes: ['flat_id', 'flat_number', 'building_name', 'floor'] }],
      attributes: { exclude: ['password'] }
    });
    if (!resident) return res.status(404).json({ message: 'Resident not found' });
    res.json(resident);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update resident
// @route   PUT /api/residents/:id
// @access  Private/Admin
const updateResident = async (req, res) => {
  try {
    const resident = await Resident.findByPk(req.params.id);
    if (!resident) return res.status(404).json({ message: 'Resident not found' });
    const { name, email, phone, flat_id, resident_type } = req.body;
    await resident.update({ name, email, phone, flat_id, resident_type });
    res.json({ message: 'Resident updated', resident });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete resident
// @route   DELETE /api/residents/:id
// @access  Private/Admin
const deleteResident = async (req, res) => {
  try {
    const resident = await Resident.findByPk(req.params.id);
    if (!resident) return res.status(404).json({ message: 'Resident not found' });
    await resident.destroy();
    res.json({ message: 'Resident removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getResidents, getResidentById, updateResident, deleteResident };
