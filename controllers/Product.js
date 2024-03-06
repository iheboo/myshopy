const { log } = require('console');
const { Product, Category } = require('../models');

// Create a new product
const createProduct = async (req, res) => {
  try {
    const token = req.cookies.userToken;

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Check if the category exists before creating a new product
    const categoryId = req.params._id;
    const categoryExists = await Category.findByPk(categoryId);
    console.log('categoryId:', categoryId);
    console.log('Category exists:', categoryExists);

    if (!categoryExists) {
      console.log("Category does not exist:", categoryExists);
      return res.status(400).json({ message: 'Category does not exist. Cannot create a new product.' });
    }

    const newProduct = await Product.create({ ...req.body, categoryId: categoryExists.id });
    console.log("Product created:", newProduct);

    res.status(201).json(newProduct);
    console.log("Product details:", newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating product.' });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching products.' });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findByPk(productId);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching product.' });
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const token =req.cookies.userToken
    if (!token) {
      // console.log(req.cookies.userToken,'ggggggggggggg')
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    const [updatedRowsCount, updatedProduct] = await Product.update(req.body, {
      where: { id: productId },
      returning: true,
    });
    if (updatedRowsCount > 0) {
      res.status(200).json(updatedProduct[0]);
    } else {
      res.status(404).json({ message: 'Product not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating product.' });
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const token =req.cookies.userToken
    if (!token) {
      // console.log(req.cookies.userToken,'ggggggggggggg')
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    const deletedRowsCount = await Product.destroy({ where: { id: productId } });
    if (deletedRowsCount > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Product not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting product.' });
  }
};

// Function to handle product photo upload and retrieval 
const productPhotoController = async (req, res) => {
  try {
    // If the request has a file attached, it means it's an upload
    if (req.file) {
      const { pid } = req.params;
      const product = await Product.findById(pid);

      // Update the product's photo information
      product.photo.data = req.file.buffer;
      product.photo.contentType = req.file.mimetype;

      // Save the updated product
      await product.save();

      return res.status(200).json({
        success: true,
        message: "Product photo uploaded successfully",
      });
    } else {
      // If no file attached, it's a request for fetching the photo
      const product = await Product.findById(req.params.pid).select("photo");

      if (product.photo.data) {
        res.set("Content-type", product.photo.contentType);
        return res.status(200).send(product.photo.data);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while handling product photo",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  productPhotoController,
};
