const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
    as: 'users', // Alias deve ser usado nos controllers
  });
  Address.hasMany(models.Client, {
    foreignKey: 'addressId',
    as: 'clients', // Alias deve ser usado nos controllers
  });
};

module.exports = Address;
