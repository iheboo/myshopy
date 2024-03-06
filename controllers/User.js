const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
  try {
    const { name, phone, address, email, password, role } = req.body;
    // Check if user with the same email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists.' });
    }else{
      
          // Hash the password before saving it to the database
          const hashedPassword = await bcrypt.hash(password, 10);
      
          // Create the user
          const newUser = await User.create({
            role, // Add this line to set the role
            name,
            phone,
            email,
            address,
            password: hashedPassword
          });
      
          // Generate JWT token for authentication
          const token = jwt.sign(
            { id: newUser.id, phone: newUser.phone, email: newUser.email, address: newUser.address, role: newUser.role },
            secret,
            { expiresIn: '1h' }
          );
      
          res.cookie('userToken', token, { httpOnly: true }); // Set the token as a cookie
          res.status(201).json({ user: newUser, token });
    }
  }catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user. ' + error.message });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Find the user or admin by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Compare the provided password with the hashed password in the database
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Check if the user is an admin
    if (role === 'admin' && user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    // Create a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: '1h' } // Set the token expiration time as needed
    );

    // Set the token as a cookie
    res.cookie('userToken', token, { httpOnly: true });

    res.status(200).json({
      message: 'Login successful.',
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        address: user.address,
        phone: user.phone,
        email: user.email,
        img: user.img,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in.' });
  }
};
  const logoutUser = (req, res) => {
    try {
      const { userToken } = req.cookies;
      console.log('Received Cookies:', req.cookies);
  
      if (!userToken) {
        return res.status(400).json({ message: 'Token not found.' });
      }
  
      // Perform any necessary cleanup logic
      // (e.g., store the token in a revoked tokens list in the database)
  
      // Clear the token cookie
      res.clearCookie('userToken');
  
      res.status(204).json({ message: 'User logged out successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error logging out.' });
    }
  };
  // Get user credit statistics for the admin dashboard
const getUserCreditStatistics = async (req, res, next) => {
  try {
    // Use aggregation to calculate user credit statistics
    const userCreditStatistics = await User.aggregate([
      {
        $group: {
          _id: null,
          totalCredit: { $sum: "$credit" },
          averageCredit: { $avg: "$credit" },
          highestCredit: { $max: "$credit" },
          lowestCredit: { $min: "$credit" },
        },
      },
    ]);

    // Return the user credit statistics as a JSON response
    res.status(200).json(userCreditStatistics[0]);
  } catch (err) {
    // Handle errors by passing them to the error handling middleware
    next(err);
  }
};
  module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserCreditStatistics,
  };
  
