const { Resident, Flat, Owner, Tenant } = require('../models');

// @desc    Get all residents
// @route   GET /api/residents
// @access  Private/Admin
const getResidents = async (req, res) => {
  try {
    const residents = await Resident.findAll({
      include: [{ 
        model: Flat, 
        as: 'flats',
        attributes: ['flat_id', 'flat_number', 'block', 'floor', 'type'] 
      }],
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
      include: [{ 
        model: Flat, 
        as: 'flats',
        attributes: ['flat_id', 'flat_number', 'block', 'floor', 'type'] 
      }],
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
    
    const { 
      first_name, last_name, email, phone, 
      flat_id, resident_type, ownership_type, 
      status, move_in_date 
    } = req.body;

    await resident.update({ 
      first_name, last_name, email, phone, 
      flat_id, resident_type, ownership_type, 
      status, move_in_date 
    });

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
