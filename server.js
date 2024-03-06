const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models/index'); // Import sequelize instance
dotenv.config();
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const reviewRoutes = require('./routes/review.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const orderRoutes = require('./routes/order.routes');

const app = express();

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(cookieParser());

// Error middleware (if needed)
const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
};
app.use(errorMiddleware);

// Sync the models with the database
sequelize.sync()
  .then(() => {
    console.log('Sequelize models synced with the database');
    // Your server startup code
  })
  .catch((error) => {
    console.error('Error syncing Sequelize models:', error);
  });

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/product', productRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/order', orderRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
