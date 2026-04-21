const { Complaint, Resident } = require('../models');

// @desc    Get all complaints (Filter by user if not admin)
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
  try {
    let whereClause = {};
    if (req.user.resident_type !== 'Admin') {
      whereClause = { resident_id: req.user.resident_id };
    }

    const complaints = await Complaint.findAll({
      where: whereClause,
      include: [{ model: Resident, attributes: ['first_name', 'last_name', 'phone'] }]
    });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Raise a complaint
// @route   POST /api/complaints
// @access  Private/Resident
const createComplaint = async (req, res) => {
  try {
    const { description, complaint_type, priority } = req.body;

    const complaint = await Complaint.create({
      resident_id: req.user.resident_id,
      description,
      complaint_type,
      priority,
      status: 'Open'
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update complaint status
// @route   PATCH /api/complaints/:id
// @access  Private/Admin
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByPk(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    await complaint.save();

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getComplaints,
  createComplaint,
  updateComplaintStatus
};
