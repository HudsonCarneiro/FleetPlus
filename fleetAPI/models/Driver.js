const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Driver = sequelize.define('Driver', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  cnh: {
    type: DataTypes.STRING(25),
    allowNull: false,
    unique: true,
    validate: {
      isNumeric: true,
      len: [11, 11],
    },
  },
  phone: {
    type: DataTypes.STRING(25),
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
});

// Associações
Driver.associate = (models) => {
  // Um driver pode ter vários abastecimentos
  Driver.hasMany(models.Fueling, {
    foreignKey: 'driverId',
    as: 'fuelings',
  });

  // Um driver pertence a uma empresa
  Driver.belongsTo(models.Company, {
    foreignKey: 'companyId',
    as: 'company',
  });
};

module.exports = Driver;
