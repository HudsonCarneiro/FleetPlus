'use strict';
const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn('Users', 'loginAttempts', {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    });

    await queryInterface.addColumn('Users', 'blockExpires', {
      type: DataTypes.DATE,
      defaultValue: null,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'loginAttempts');
    await queryInterface.removeColumn('Users', 'blockExpires');
  }
};

