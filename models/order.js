'use strict';
const {
  Model
} = require('sequelize');
const { DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
  // Define associations for Order
  Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' }); // An order belongs to a user
  Order.belongsToMany(models.Product, { // An order can have multiple products
    through: 'OrderItem',
    foreignKey: 'orderId',
    as: 'products',
  });
    }
  }
  Order.init({
    items: DataTypes.JSON, // You can use JSON or JSONB based on your database
    amount: DataTypes.FLOAT,
    quantity: DataTypes.INTEGER,
    address: DataTypes.JSON,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};