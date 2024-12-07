const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); // Importando o modelo User

const Address = sequelize.define('Address', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cep: {
    type: DataTypes.STRING(9),
    allowNull: false,
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  road: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

  
  complement: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING(100), 
    allowNull: false,
  },
});

// Definindo associações
Address.associate = (models) => {
  Address.hasMany(models.User, {
    foreignKey: 'addressId',
    as: 'users',
  });
  Address.hasMany(models.Client, {
    foreignKey: 'addressId',
    as: 'clients',
  });
};

module.exports = Address;
