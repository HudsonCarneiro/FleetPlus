const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fueling = sequelize.define('Fueling', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
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

Fueling.associate = (models) => {
  Fueling.belongsTo(models.User, { foreignKey: 'userId' });
  Fueling.belongsTo(models.Driver, { foreignKey: 'driverId' });
  Fueling.belongsTo(models.Vehicle, { foreignKey: 'vehicleId' });
};

module.exports = Fueling;
