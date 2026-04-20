const app = require('./app');
const { connectDB, sequelize } = require('./config/db');
require('./models'); // Load models and associations

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  
  // Sync database (in production, use migrations)
  if (process.env.NODE_ENV === 'development') {
    // await sequelize.sync({ force: false }); // Change to true carefully
    // console.log('Database synced');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

startServer();
