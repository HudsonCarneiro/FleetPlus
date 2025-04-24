const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true, 
    primaryKey: true,
  },
  cnpj: {
    type: DataTypes.STRING(14),
    allowNull: true,
  },
  companyName: {
    type: DataTypes.STRING(55),
    allowNull: false,
  },
  businessName: {
    type: DataTypes.STRING(55),
    allowNull: false,
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
// Definindo associações
User.associate = (models) => {
    // Relacionamentos de um para muitos
    Company.hasMany(models.Client, {
      foreignKey: 'companyId',
      as: 'clients',
    });
    Company.hasMany(models.DeliveryOrder, {
      foreignKey: 'companyId',
      as: 'deliveryOrders',
    });
    Company.hasMany(models.Driver, {
      foreignKey: 'companyId',
      as: 'drivers',
    });
    Company.hasMany(models.Fueling, {
      foreignKey: 'companyId',
      as: 'fuelings',
    });
    Company.hasMany(models.Vehicle, {
      foreignKey: 'companyId',
      as: 'vehicles',
    });
  
    Company.belongsTo(models.Address, {
      foreignKey: 'addressId',
      as: 'address', 
    });
  };
  
module.exports = Company;
