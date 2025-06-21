const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true, 
    primaryKey: true,
  },
  companyName: {
    type: DataTypes.STRING(55),
    allowNull: false,
  },
  businessName: {
    type: DataTypes.STRING(55),
    allowNull: false,
  },
  cnpj: {
    type: DataTypes.STRING(14),
    allowNull: true,
  },
  addressId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Addresses', 
      key: 'id',
    },
  },
});

Company.associate = (models) => {
  Company.hasMany(models.User, {
    foreignKey: 'companyId',
    as: 'users',
    onDelete: 'RESTRICT' 
  });
};

  
module.exports = Company;
