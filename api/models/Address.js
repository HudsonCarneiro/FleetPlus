const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Certifique-se de estar importando a função corretamente

const Address = sequelize.define('Address', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cep: {
        type: DataTypes.STRING(9),
        allowNull: false,
    },
    number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    road: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    complement: {
        type: DataTypes.STRING(100),
        allowNull: true 
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    state: {
        type: DataTypes.STRING(100), 
        allowNull: false
    },
});

module.exports = Address;
