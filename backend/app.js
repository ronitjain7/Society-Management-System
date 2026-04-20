const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
const flatRoutes = require('./routes/flatRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const parkingRoutes = require('./routes/parkingRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const residentRoutes = require('./routes/residentRoutes');
const visitorRoutes = require('./routes/visitorRoutes');
const statsRoutes = require('./routes/statsRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/flats', flatRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/parking', parkingRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/residents', residentRoutes);
app.use('/api/visitors', visitorRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Smart Apartment Management System API' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

module.exports = app;
