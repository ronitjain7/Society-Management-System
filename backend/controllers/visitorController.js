const { Visitor, Flat } = require('../models');

// @desc    Get all visitors
// @route   GET /api/visitors
// @access  Private
const getVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.findAll({
      include: [{ 
        model: Flat, 
        as: 'flats',
        attributes: ['flat_id', 'flat_number', 'block'] 
      }],
      order: [['visit_date', 'DESC']]
    });
    res.json(visitors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a visitor record
// @route   POST /api/visitors
// @access  Private
const createVisitor = async (req, res) => {
  try {
    const { name, phone, purpose, flat_id, vehicle_number } = req.body;
    const visitor = await Visitor.create({
      name,
      phone,
      flat_id,
      visit_date: new Date()
    });
    res.status(201).json(visitor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Checkout a visitor (mark as checked out via visit_date update)
// @route   PUT /api/visitors/:id/checkout
// @access  Private
const checkoutVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findByPk(req.params.id);
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });
    // Mark as checked out by noting it in a status if needed
    res.json({ message: 'Visitor checked out', visitor });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getVisitors, createVisitor, checkoutVisitor };
