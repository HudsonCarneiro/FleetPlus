const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ServiceProvider = sequelize.define('ServiceProvider', {
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
    { unique: true, fields: ['cnpj'] },
  ],
});

// Definindo associações
ServiceProvider.associate = (models) => {
  ServiceProvider.hasMany(models.Maintenance, {
    foreignKey: 'serviceProviderId',
    as: 'maintenances', 
  });
  ServiceProvider.belongsTo(models.Company, { 
    foreignKey: 'companyId',
    as: 'company', 
  });
};

module.exports = ServiceProvider;

