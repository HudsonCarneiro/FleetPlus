const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Driver = sequelize.define('Driver', {
  name: {
      type: DataTypes.STRING,
      allowNull: false
  },
  cnh:{
    type: DataTypes.STRING
  },
  phone:{
    type: DataTypes.STRING
  },
  cep:{
    type: DataTypes.STRING
  },
  street:{
    type: DataTypes.STRING
  },
  number:{
    type: DataTypes.STRING
  },
  neighborhood:{
    type: DataTypes.STRING
  },
  city:{
    type: DataTypes.STRING
  },
  uf:{
    type: DataTypes.STRING
  }
});

module.exports = Driver;