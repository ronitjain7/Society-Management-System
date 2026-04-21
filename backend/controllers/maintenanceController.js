const { Maintenance, Flat, Payment } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all maintenance records
// @route   GET /api/maintenance
const getMaintenance = async (req, res) => {
  try {
    const { flat_id } = req.query;
    let whereClause = {};
    if (flat_id) whereClause = { flat_id };

    const records = await Maintenance.findAll({ 
      where: whereClause,
      include: [
        { model: Flat, as: 'flats', attributes: ['flat_id', 'flat_number', 'block', 'floor', 'type'] },
        { model: Payment, as: 'payments' }
      ] 
    });
    res.json(records);
  } catch (error) {
    console.error(error);
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
    const { amount_paid, payment_mode, transaction_id } = req.body;
    const bill = await Maintenance.findByPk(req.params.id);
    
    if (!bill) return res.status(404).json({ message: 'Bill not found' });

    // Create payment record
    await Payment.create({
        maintenance_id: bill.maintenance_id,
        amount_paid,
        payment_mode,
        transaction_id,
        payment_date: new Date()
    });

    bill.status = 'Paid';
    bill.payment_date = new Date();
    await bill.save();

    res.json(bill);
  } catch (error) {
    console.error(error);
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
