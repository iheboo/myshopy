// models/orderItem.js
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
 // Define association with Order and Product models
 OrderItem.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' }); // An order item belongs to an order
 OrderItem.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' }); // An order item belongs to a product
    }
  }
  OrderItem.init({
    // ... (other fields)
  }, {
    sequelize,
    modelName: 'OrderItem',
  });
  return OrderItem;
};
