const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Resident, Owner, Tenant } = require('../models');

// @desc    Register a new resident
// @route   POST /api/auth/register
const registerResident = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, password, resident_type, flat_id, ownership_type, move_in_date, status } = req.body;

    // Check if user exists
    const userExists = await Resident.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create resident
    const resident = await Resident.create({
      first_name,
      last_name,
      email,
      phone,
      password: hashedPassword,
      resident_type: resident_type || 'Owner',
      ownership_type: ownership_type || resident_type || 'Owner',
      flat_id,
      move_in_date,
      status: status || 'Active'
    });

    res.status(201).json({
      id: resident.resident_id,
      first_name: resident.first_name,
      last_name: resident.last_name,
      email: resident.email,
      resident_type: resident.resident_type,
      token: generateToken(resident.resident_id)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Authenticate a resident
// @route   POST /api/auth/login
const loginResident = async (req, res) => {
  try {
    const { email, password } = req.body;

    const resident = await Resident.findOne({ where: { email } });

    if (resident && (await bcrypt.compare(password, resident.password))) {
      res.json({
        id: resident.resident_id,
        first_name: resident.first_name,
        last_name: resident.last_name,
        email: resident.email,
        resident_type: resident.resident_type,
        token: generateToken(resident.resident_id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get current resident profile
// @route   GET /api/auth/profile
// @access  Private
const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

module.exports = {
  registerResident,
  loginResident,
  getMe
};
