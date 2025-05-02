const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  businessName: {
    type: DataTypes.STRING(255), 
    allowNull: false,
  },
  companyName: {
    type: DataTypes.STRING(255), 
    allowNull: false,
  },
  cnpj: {
    type: DataTypes.STRING(14), 
    allowNull: false,
    unique: true,
    validate: {
      isNumeric: true, 
      len: [14, 14], 
    },
  },
  phone: {
    type: DataTypes.STRING(15), 
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(100), 
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  addressId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Addresses', // Nome correto da tabela no banco de dados
      key: 'id',
    },
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Companies', 
      key: 'id',
    },
  },
}, {
  timestamps: true, 
  paranoid: true,
  indexes: [
    { unique: true, fields: ['email'] },
    { unique: true, fields: ['cnpj'] },
  ],
});

// Definindo associações
Client.associate = (models) => {
  Client.hasMany(models.DeliveryOrder, {
    foreignKey: 'clientId',
    as: 'deliveryOrders', 
  });
  Client.belongsTo(models.Address, {
    foreignKey: 'addressId',
    as: 'address', 
  });
  Client.belongsTo(models.Company, { 
    foreignKey: 'companyId',
    as: 'company', 
  });
};

module.exports = Client;
