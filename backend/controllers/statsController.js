const { Flat, Maintenance, Complaint, Parking } = require('../models');
const { sequelize } = require('../config/db');

const getSummaryStats = async (req, res) => {
  try {
    // 1. Occupancy Stats
    const totalFlats = await Flat.count();
    const occupiedParking = await Parking.count({ where: { status: 'Occupied' } });
    
    // 2. Financial Stats (Total Collected vs Total Due)
    const financialStats = await Maintenance.findAll({
      attributes: [
        'status',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount']
      ],
      group: ['status']
    });

    // 3. Complaint Distribution
    const complaintStats = await Complaint.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('complaint_id')), 'count']
      ],
      group: ['status']
    });

    res.json({
      occupancy: {
        total: totalFlats,
        occupied: occupiedParking // Simplified proxy for occupancy
      },
      finance: financialStats,
      complaints: complaintStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getSummaryStats };
