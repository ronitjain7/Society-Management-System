const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Resident, Owner, Tenant } = require('../models');

// @desc    Register a new resident (Admin only usually, but open for now for setup)
// @route   POST /api/auth/register
// @access  Public (Should be Admin restricted later)
const registerResident = async (req, res) => {
  try {
    const { name, email, phone, password, resident_type, flat_id, extra_details } = req.body;

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
      name,
      email,
      phone,
      password: hashedPassword,
      resident_type,
      flat_id
    });

    // Handle specialized attributes (Owner/Tenant)
    if (resident_type === 'Owner' && extra_details?.ownership_date) {
      await Owner.create({
        resident_id: resident.resident_id,
        ownership_date: extra_details.ownership_date
      });
    } else if (resident_type === 'Tenant' && extra_details) {
      await Tenant.create({
        resident_id: resident.resident_id,
        rent: extra_details.rent,
        lease_start: extra_details.lease_start,
        lease_end: extra_details.lease_end
      });
    }

    res.status(201).json({
      id: resident.resident_id,
      name: resident.name,
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
// @access  Public
const loginResident = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for resident email
    const resident = await Resident.findOne({ where: { email } });

    if (resident && (await bcrypt.compare(password, resident.password))) {
      res.json({
        id: resident.resident_id,
        name: resident.name,
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
