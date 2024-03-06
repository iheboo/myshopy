'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = require('sequelize');
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      role: {
        type: DataTypes.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user', // Corrected default value syntax
      },
      name: {
        type: Sequelize.STRING, 
        allowNull: false,
        validate: {
          len: {
            args: [3],
            msg: 'Name must be at least 3 characters.',
          },
        },
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [4],
            msg: 'Address must be at least 4 characters.',
          },
        },
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
        validate: {
          isNumeric: {
            msg: 'Phone number must be numeric.',
          },
          len: {
            args: [8],
            msg: 'Phone number must have 8 digits.',
          },
        },
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          msg: 'Email already exists.',
        },
        validate: {
          isEmail: {
            msg: 'Email is not valid.',
          },
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [8],
            msg: 'Password must be 8 characters or longer.',
          },
        },
      },
      img: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
