const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Driver = sequelize.define('Driver', {
    name: {
        type: DataTypes.STRING(100), 
        allowNull: false
    },
    cnh: {
        type: DataTypes.STRING(25), 
        allowNull: false,
        validate: {
            isNumeric: true, 
            len: [11, 11] 
        }
    },
    phone: {
        type: DataTypes.STRING(25), 
        allowNull: true, 
    },
});

Driver.associate = (models) => {
    Driver.hasMany(models.Fueling, {
        foreignKey: 'driverId'
    });
    Driver.belongsTo(models.Address, {
        foreignKey: 'addressId'
    });
};

module.exports = Driver;
