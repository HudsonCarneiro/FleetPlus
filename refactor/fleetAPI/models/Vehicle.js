const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    plate: {
        type: DataTypes.STRING(7), 
        allowNull: false,
        unique: true,
    },
    model: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    automaker: {
        type: DataTypes.STRING(100), 
        allowNull: true
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1900, // Ano mínimo
            max: new Date().getFullYear() // Não pode ser maior que o ano atual
        }
    },
    fuelType: {
        type: DataTypes.STRING(50), 
        allowNull: true,
    },
    mileage: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0 // A quilometragem não pode ser negativa
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
          },
      
    }
});

Vehicle.associate = (models) => {
    Vehicle.hasMany(models.Fueling, {
        foreignKey: 'vehicleId'
    });
    Vehicle.belongsTo(models.User, { 
        foreignKey: 'userId' 
    });
};

module.exports = Vehicle;
