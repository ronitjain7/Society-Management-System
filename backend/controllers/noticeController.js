const { Notice } = require('../models');

// @desc    Get all notices
const getNotices = async (req, res) => {
  try {
    const notices = await Notice.findAll({ order: [['date', 'DESC']] });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a notice (Admin)
const createNotice = async (req, res) => {
  try {
    const { title, content } = req.body;
    const notice = await Notice.create({ title, content });
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getNotices, createNotice };
