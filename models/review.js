'use strict';
const {
  Model
} = require('sequelize');
const { DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.Product); // Assuming a Product model exists
      // User.hasMany(models.Review, { foreignKey: 'userId', as: 'reviews' });
    }
  }
  Review.init({
    content: DataTypes.TEXT,
    like: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};