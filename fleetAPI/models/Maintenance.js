const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Maintenance = sequelize.define('Maintenance', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  nfe: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('conserto', 'lavagem', 'troca de oleo', 'outro'),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  serviceProviderId: {
    type: DataTypes.INTEGER,
    allowNull: false, 
    references: {
        model: 'ServiceProvider',
        key: 'id',
    },
    validate: {
        min: 1,
    },
  },
  vehicleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Vehicles',
      key: 'id',
    },
    validate: {
      isInt: true,
      min: 1,
    },
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01,
    },
  },
  status: {
    type: DataTypes.ENUM('aberto', 'parcelado', 'pago'), 
    allowNull: false,
    defaultValue: 'aberto'
  },
});

Maintenance.associate = (models) => {
  Maintenance.belongsTo(models.User, { foreignKey: 'userId' });
  Maintenance.belongsTo(models.ServiceProvider, { foreignKey: 'serviceProviderId' });
  Maintenance.belongsTo(models.Vehicle, { foreignKey: 'vehicleId' });
};


module.exports = Maintenance;
