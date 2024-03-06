const { Category } = require('../models');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

// Create a new category (admin only)
const createCategory = async (req, res) => {
  // const Category = Category.build({ Category })
  try {
    const token =req.cookies.userToken
    
    const {  ...categoryData } = req.body;
    

    if (!token) {
      // console.log(req.cookies.userToken,'ggggggggggggg')
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, secret);
    // console.log(token)


    // Optionally, you can check the user's role or other claims in the token
    const userRole = decoded.role;
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Insufficient permissions.' });
    }

    const newCategory = await Category.create(categoryData);
    // console.log(req.cookies.userToken,'ggggggggggggg')
    res.status(201).json(newCategory);
  } catch (error) {
    console.error(error);
    
    res.status(500).json({ message: 'Error creating category.', error });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching categories.' });
  }
};

// Get a single category by ID
const getCategoryById = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const category = await Category.findByPk(categoryId);
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ message: 'Category not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching category.' });
  }
};

// Update a category by ID (admin only)
const updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const { ...updatedCategoryData } = req.body;
    const token =req.cookies.userToken

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, secret);

    // Optionally, you can check the user's role or other claims in the token
    const userRole = decoded.role;
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Insufficient permissions.' });
    }

    const [updatedRowsCount, updatedCategory] = await Category.update(updatedCategoryData, {
      where: { id: categoryId },
      returning: true,
    });
    if (updatedRowsCount > 0) {
     
      res.status(200).json(updatedCategory[0],{ message: 'missions well.'} );
    } else{
       console.log(updatedRowsCount,'*********************************************')
      res.status(404).json({ message: 'Category not found.' });
    }
  } catch (error) {
    console.error(error);
    
    res.status(500).json({ message: 'Error updating category.' });
  }
};

// Delete a category by ID (admin only)
const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const token =req.cookies.userToken

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, secret);

    // Optionally, you can check the user's role or other claims in the token
    const userRole = decoded.role;
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Insufficient permissions.' });
    }

    const deletedRowsCount = await Category.destroy({ where: { id: categoryId } });
    if (deletedRowsCount > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Category not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting category.' });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
