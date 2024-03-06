const { User } = require('../models/user');

// Create a new user for the admin dhachebord  
const createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user.' });
  }
};

// Get all users for the admin dhachebord 
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users.' });
  }
};

// Get a single user by ID  for the admin dhachebord 
const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user.' });
  }
};

// Update a user by ID  for the user 
const updateUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const [updatedRowsCount, updatedUser] = await User.update(req.body, {
      where: { id: userId },
      returning: true,
    });
    if (updatedRowsCount > 0) {
      res.status(200).json(updatedUser[0]);
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user.' });
  }
};

// Delete a user by ID  for the admin dhachebord 
const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedRowsCount = await User.destroy({ where: { id: userId } });
    if (deletedRowsCount > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting user.' });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
