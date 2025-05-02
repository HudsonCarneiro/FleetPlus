const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fueling = sequelize.define('Fueling', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Companies',
      key: 'id',
    },
  },
  driverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Drivers',
      key: 'id',
    },
    validate: {
      isInt: true,
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
  liters: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01,
    },
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01,
    },
  },
  mileage: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  dateFueling: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

// Associação padrão com alias
Fueling.associate = (models) => {
  Fueling.belongsTo(models.Company, {
    foreignKey: 'companyId',
    as: 'company',
  });

  Fueling.belongsTo(models.Driver, {
    foreignKey: 'driverId',
    as: 'driver',
  });

  Fueling.belongsTo(models.Vehicle, {
    foreignKey: 'vehicleId',
    as: 'vehicle',
  });
};

module.exports = Fueling;
