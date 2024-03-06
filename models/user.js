'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Define associations for User
      User.hasOne(models.Product, { foreignKey: 'userId' });
      User.hasMany(models.Order, { foreignKey: 'userId', as: 'orders' });
      User.hasMany(models.Review, { foreignKey: 'userId', as: 'reviews' });
    }
  }
  User.init({
    role: {
      type: DataTypes.ENUM('admin', 'user'), // Specify valid values for the ENUM type
      allowNull: false,
      defaultValue: 'user',
    },
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: {
      type: DataTypes.STRING(20), // Adjust the length as per your database schema
      allowNull: true, // or false, depending on your requirements
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    img: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
