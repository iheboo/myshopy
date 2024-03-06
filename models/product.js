'use strict';
const { Model } = require('sequelize');
const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
  // Define associations for Product
  Product.belongsTo(models.User, { foreignKey: 'userId' }); // A product belongs to a user
  Product.belongsToMany(models.Category, { // A product belongs to multiple categories
    through: 'ProductCategory',
    foreignKey: 'productId',
    otherKey: 'categoryId',
  });
  Product.hasMany(models.Review, { foreignKey: 'productId' }); // A product can have multiple reviews
  Product.belongsToMany(models.Order, { // A product can be part of multiple orders
    through: 'OrderItem',
    foreignKey: 'productId',
    as: 'orders',
  });
    }
  }
  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.FLOAT,
    img: DataTypes.STRING,
    inStock: DataTypes.BOOLEAN,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });

  return Product;
};
