const { Maintenance, Flat } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all maintenance records
// @route   GET /api/maintenance
const getMaintenance = async (req, res) => {
  try {
    const records = await Maintenance.findAll({ include: [Flat] });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create maintenance bill (Admin)
const createBill = async (req, res) => {
  try {
    const { flat_id, amount, due_date } = req.body;
    const bill = await Maintenance.create({ flat_id, amount, due_date, status: 'Unpaid' });
    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Pay maintenance bill
const payBill = async (req, res) => {
  try {
    const bill = await Maintenance.findByPk(req.params.id);
    if (!bill) return res.status(404).json({ message: 'Bill not found' });

    bill.status = 'Paid';
    bill.payment_date = new Date();
    await bill.save();

    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Advanced Logic: Auto-detect overdue bills
// @route   POST /api/maintenance/check-overdue
const checkOverdue = async (req, res) => {
  try {
    const today = new Date();
    const [updatedCount] = await Maintenance.update(
      { status: 'Overdue' },
      {
        where: {
          due_date: { [Op.lt]: today },
          status: { [Op.in]: ['Unpaid', 'Partial'] }
        }
      }
    );

    res.json({ message: `${updatedCount} bills marked as Overdue.` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMaintenance,
  createBill,
  payBill,
  checkOverdue
};
