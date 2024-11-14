const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fueling = sequelize.define('Fueling', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //     model: 'User',
        //     key: 'id',
        // }
    },
    driverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //     model: 'Driver',
        //     key: 'id',
        // }
    },
    vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //     model: 'Vehicle',
        //     key: 'id',
        // }
    },
    liters: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0.01 // Garantir que a quantidade de litros seja positiva
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0.01 // Garantir que o preço seja positivo
        }
    },
    mileage: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    dateFueling: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

Fueling.associate = (models) => {
    Fueling.belongsTo(models.User, { foreignKey: 'userId' });
    Fueling.belongsTo(models.Driver, { foreignKey: 'driverId' });
    Fueling.belongsTo(models.Vehicle, { foreignKey: 'vehicleId' });
};

module.exports = Fueling;
