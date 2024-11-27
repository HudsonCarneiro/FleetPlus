const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    model: {
        type: DataTypes.STRING(100), // Limite de 100 caracteres
        allowNull: false
    },
    automaker: {
        type: DataTypes.STRING(100), // Limite de 100 caracteres
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
        type: DataTypes.STRING(50), // Limite de 50 caracteres
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
