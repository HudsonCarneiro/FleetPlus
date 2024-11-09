const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Address = sequelize.define('Address', {
    cep: {
        type: DataTypes.STRING(9),
        allowNull: false,
        validate: {
            is: /\d{5}-\d{3}/, 
        }
    },
    number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    road: {
        type: DataTypes.STRING(255), // Limitação de comprimento sugerida
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING(2), // Armazena siglas dos estados
        allowNull: false
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    complement: {
        type: DataTypes.STRING,
        allowNull: true 
    }
});

Address.associate = (models) => {
    Address.hasMany(models.User, {
        foreignKey: 'addressId',
        as: 'users' 
    });

    Address.hasMany(models.Client, {
        foreignKey: 'addressId',
        as: 'clients'
    });

    Address.hasMany(models.Driver, {
        foreignKey: 'addressId',
        as: 'drivers'
    });
};

module.exports = Address;
