'use strict';
const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn('Users', 'isBlocked', {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'isBlocked');
  }
};

